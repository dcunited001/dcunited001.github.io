"use strict";

// performed once every n frames
// (1) on particle qi/pi update shader
// - attach a render buffer and render when indicated by uniforms
//   - essentially render a copy of the qi/pi data
// (2) blit into MipReducer pipeline
// - mip reducer will have two framebuffers to ping pong data from a renderbuffer
//   - unless this can be done on a single framebuffer
// (3) finally the data is aggregated to a level of diminishing returns
// - at this point, readPixels or a transform feedback call (yuck) can push
//   the data to a buffer or an array of floats
// - CPU binds to data point on LinePlot

// https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/glFramebufferRenderbuffer.xhtml
// - https://www.khronos.org/opengl/wiki/Framebuffer
//   - (source & destination can bee the same)
//   - at least in OpenGL


// TODO: refactor attachments to instances of a class
class MipReducerAttachment {
  constructor(attr) {
    this._id = attr.id;
    this._defaultValue = attr.defaultValue;
    this._internalFormat = attr.internalFormat;
    this._init = attr.init;
    this._calc = attr.calc;
    this._write = attr.write;

    this._textures = [];
  }

  get id() { return this._id; }
  get defaultValue() { return this._defaultValue; }
  get internalFormat() { return this._internalFormat; }
  get init() { return this._init; }
  get calc() { return this._calc; }
  get write() { return this._write; }

  get textures() { return this._textures; }
  set textures(textures) { this._textures = textures; }

  addTexture(texture) {
    this._textures.push(texture);
  }
}

class MipReducer {
  constructor(resolution, attachments, options = {}) {
    this._resolution = resolution;
    this._requiredUniforms = ['u_iteration', 'u_readOffset', 'u_readSize', 'u_writeOffset', 'u_writeSize'];

    var logX = Math.log2(this._resolution[0]),
      logY = Math.log2(this._resolution[1]);

    this._levels = (logX > logY ? Math.trunc(logX) + 1 : Math.trunc(logY) + 1);
    this._mipmaps = this.generateMipmaps(this._resolution, this._levels);
    this._attachments = attachments;
    this._values = {};
    this._pingpongId = 0;

    this._uniforms = options.uniforms || {};
  }

  configure(context, options = {}) {
    this.createTextures(context);
    this.createFramebuffers(context);
    this.configureProgram(context);
    this.configureUniforms(context, options);

    this._samplerNearest = context.createSampler();
    context.samplerParameteri(this._samplerNearest, context.TEXTURE_MIN_FILTER, context.NEAREST);
    context.samplerParameteri(this._samplerNearest, context.TEXTURE_MAG_FILTER, context.NEAREST);
    context.samplerParameteri(this._samplerNearest, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
    context.samplerParameteri(this._samplerNearest, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
  }

  createTextures(context) {
    for (var attach of this._attachments) {
      context.activeTexture(context.TEXTURE0);
      var tex = context.createTexture();
      context.bindTexture(context.TEXTURE_2D, tex);
      context.texStorage2D(context.TEXTURE_2D, 1, attach.internalFormat, this._resolution[0], this._resolution[1]);
      context.bindTexture(context.TEXTURE_2D, null);
      attach.addTexture(tex);

      context.activeTexture(context.TEXTURE0);
      var tex = context.createTexture();
      context.bindTexture(context.TEXTURE_2D, tex);
      context.texStorage2D(context.TEXTURE_2D, 1, attach.internalFormat, this._resolution[0], this._resolution[1]);
      context.bindTexture(context.TEXTURE_2D, null);
      attach.addTexture(tex);
    }
  }

  createFramebuffers(context) {
    this._framebuffers = [context.createFramebuffer(), context.createFramebuffer()];

    for (var i = 0; i < this._framebuffers.length; i++) {
      var fbo = this._framebuffers[i];
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, fbo);

      for (var j = 0; j < this._attachments.length; j++) {
        var attach = this._attachments[j];
        var tex = attach.textures[(i+1) % 2];
        context.framebufferTexture2D(context.DRAW_FRAMEBUFFER, context[`COLOR_ATTACHMENT${j}`], context.TEXTURE_2D, tex, 0);
      }

      this.checkFboStatus(context);
      context.clearColor(0.0,0.0,0.0,0.0);
      context.clear(context.COLOR_BUFFER_BIT);
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, null);
    }
  }

  generateMipmaps(resolution, levels) {
    var firstLevel = {
      pos: vec2.fromValues(0,0),
      res: vec2.fromValues(Math.ceil(resolution[0] / 2), Math.ceil(resolution[1] / 2))
    };

    return new Int32Array(levels - 1).reduce((mips, level, i) => {
      var pos = vec2.create(), res;
      if (i % 2 == 0) {
        vec2.add(pos, mips[i].pos, vec2.fromValues(mips[i].res[0], 0));
      } else {
        vec2.add(pos, mips[i].pos, vec2.fromValues(0, mips[i].res[1]));
      }

      // each level is half the size
      res = vec2.fromValues(
        Math.ceil(mips[i].res[0] / 2),
        Math.ceil(mips[i].res[1] / 2)); // Math.round is incorrect for non-power-of-two

      mips[i+1] = { pos: pos, res: res };
      return mips
    }, [firstLevel]);
  }

  checkFboStatus(context) {
    var status = context.checkFramebufferStatus(context.DRAW_FRAMEBUFFER);
    if (status != context.FRAMEBUFFER_COMPLETE) {
      console.error('fb status: ' + status.toString(10));
    }
  }

  fragmentShaderSymbols() {
    return {
      sampler: function (attachment, i) {
        return `s_attachment${attachment.id || i}`
      },
      default: function(attachment, i) {
        return `u_attachment${attachment.id || i}Default`
      },
      texels: function (attachment, i) {
        return `attachment${attachment.id || i}Texels`;
      },
      output: function (attachment, i) {
        return `o_attachment${attachment.id || i}`
      }
    }
  };

  generateFragmentShaderSource() {
    var symbols = this.fragmentShaderSymbols();

    var varyings = `
    in vec4 v_position;
    in vec2 v_st;
    `;

    var uniforms = `
    uniform int u_iteration;
    uniform ivec2 u_readOffset;
    uniform ivec2 u_readSize;
    uniform ivec2 u_writeOffset;
    uniform ivec2 u_writeSize;
    `;

    var additionalUniforms = Object.keys(this._uniforms).map((k) => {
      return `uniform ${this._uniforms[k]} ${k};`;
    }).join("\n");

    var samplerUniforms = this._attachments.map((attach, i) => {
      var attachSampler = symbols.sampler(attach, i);
      var attachDefault = symbols.default(attach, i);

      return `
      uniform sampler2D ${attachSampler};
      uniform vec4 ${attachDefault};
      `
    }).join("\n");

    var attachmentOuts = this._attachments.map((attach, i) => {
      var attachOutput = symbols.output(attach, i);

      return `layout(location = ${i}) out vec4 ${attachOutput};`
    }).join("\n");

    var constructTexelCoords = `
    ivec2 writeUv = ivec2(trunc(gl_FragCoord.xy)) - u_writeOffset;
    ivec2 readUv = u_readOffset + writeUv * 2;
    bvec2 singleFetch;
    `;

    var readAttachments = this._attachments.map((attach, i) => {
      var texels = symbols.texels(attach, i);
      var sampler = symbols.sampler(attach, i);
      var defaultValue = symbols.default(attach, i);

      return `
      vec4 ${texels}[4];

      singleFetch = equal(readUv + ivec2(1,1), u_readOffset + u_readSize);
      ${texels}[0] = texelFetch(${sampler}, readUv, 0);
      ${texels}[1] = singleFetch.x ? ${defaultValue} : texelFetch(${sampler}, readUv + ivec2(1,0), 0);
      ${texels}[2] = singleFetch.y ? ${defaultValue} : texelFetch(${sampler}, readUv + ivec2(0,1), 0);
      ${texels}[3] = any(singleFetch.xy) ? ${defaultValue} : texelFetch(${sampler}, readUv + ivec2(1,1), 0);
      `;
    }).join("\n");

    var initAttachments = this._attachments.map((attach, i) => {
      var texels = symbols.texels(attach, i);
      var sampler = symbols.sampler(attach, i);
      var defaultValue = symbols.default(attach, i);

      if (attach.init) {
        return eval("`" + attach.init + "`");
      } else {
        return "\n";
      }
    }).join("\n");

    var calcAttachments = this._attachments.map((attach, i) => {
      var texels = symbols.texels(attach, i);
      var sampler = symbols.sampler(attach, i);
      var defaultValue = symbols.default(attach, i);

      if (attach.calc) {
        return eval("`" + attach.calc + "`");
      } else {
        return "\n"
      }
    }).join("\n");

    var writeAttachments = this._attachments.map((attach, i) => {
      var attachOutput = symbols.output(attach, i);
      var texels = symbols.texels(attach, i);

      return attachOutput + " = " + eval("`" + attach.write + "`");
    }).join("\n");

    return `
    ${varyings}
    ${uniforms}
    ${additionalUniforms}
    ${samplerUniforms}
    ${attachmentOuts}

    void main() {

    ${constructTexelCoords}
    ${readAttachments}
    if (u_iteration == -1) {
      ${initAttachments}
    }
    ${calcAttachments}
    ${writeAttachments}

    }`;
  }

  configureProgram(context) {
    var prefix = `#version 300 es
    #extension EXT_color_buffer_float : enable
    `;

    var precision = `
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    precision highp usampler2D;
    precision highp isampler2D;
    `;

    var vsPassSource = `
    layout(location = 0) in vec3 a_position;
    layout(location = 1) in vec2 a_texcoord;
    out vec2 v_st;
    out vec4 v_position;
    void main() {
      v_st = a_texcoord;
      v_position = vec4(a_position, 1.0);
      gl_Position = v_position;
    }
    `;

    var program = context.createProgram();
    var vertexShaderSource = prefix + precision + vsPassSource;
    var fragmentShaderSource = prefix + precision + this.generateFragmentShaderSource();

    var vshader = context.createShader(context.VERTEX_SHADER);
    context.shaderSource(vshader, vertexShaderSource);
    context.compileShader(vshader);

    var fshader = context.createShader(context.FRAGMENT_SHADER);
    context.shaderSource(fshader, fragmentShaderSource);
    context.compileShader(fshader);

    context.attachShader(program, vshader);
    context.attachShader(program, fshader);
    context.linkProgram(program);

    var log = context.getProgramInfoLog(program);
    if (log) {
      console.log(log);
    }

    log = context.getShaderInfoLog(vshader);
    if (log) {
      console.log(log);
    }

    log = context.getShaderInfoLog(fshader);
    if (log) {
      console.log(log);
    }

    this._program = program;
  }

  configureUniforms(context, options) {
    var symbols = this.fragmentShaderSymbols();

    var uniforms = this._requiredUniforms.concat(options.uniforms || []);
    this._uniformLocations = uniforms.reduce((acc, name) => {
      acc[name] = context.getUniformLocation(this._program, name);
      return acc;
    }, {});

    for (var i = 0; i < this._attachments.length; i++ ) {
      var attach = this._attachments[i];
      attach.samplerName = symbols.sampler(attach, i);
      attach.samplerDefault = symbols.default(attach, i);
      attach.samplerUniformLocation = context.getUniformLocation(this._program, attach.samplerName);
      attach.samplerDefaultUniformLocation = context.getUniformLocation(this._program, attach.samplerDefault)
    }
  }

  encodeLevel(context, iteration, uniforms, ops = {}) {
    context.bindFramebuffer(context.DRAW_FRAMEBUFFER, this._framebuffers[this._pingpongId]);
    context.blendFunc(context.ONE, context.ZERO);

    context.uniform1i(this._uniformLocations.u_iteration, iteration);
    if (iteration == -1) {
      context.uniform2iv(this._uniformLocations.u_readOffset, vec2.fromValues(0,0));
      context.uniform2iv(this._uniformLocations.u_readSize, this._resolution);
    } else {
      context.uniform2iv(this._uniformLocations.u_readOffset, this._mipmaps[iteration].pos);
      context.uniform2iv(this._uniformLocations.u_readSize, this._mipmaps[iteration].res);
    }
    context.uniform2iv(this._uniformLocations.u_writeOffset, this._mipmaps[iteration+1].pos);
    context.uniform2iv(this._uniformLocations.u_writeSize, this._mipmaps[iteration+1].res);

    context.viewport(
      this._mipmaps[iteration+1].pos[0],
      this._mipmaps[iteration+1].pos[1],
      this._mipmaps[iteration+1].res[0],
      this._mipmaps[iteration+1].res[1]);

  }

  encodeTextures(context, iteration, uniforms, ops = {}) {
    for (var i = 0; i < this._attachments.length; i++) {
      var attach = this._attachments[i];
      var texture;
      if (iteration == -1) {
        texture = ops[attach.id]
      } else {
        texture = attach.textures[this._pingpongId];
      }
      context.activeTexture(context[`TEXTURE${i}`]);
      context.uniform1i(attach.samplerUniformLocation, i);
      context.uniform4fv(attach.samplerDefaultUniformLocation, attach.defaultValue);
      context.bindTexture(context.TEXTURE_2D, texture);
      context.bindSampler(i, this._samplerNearest);
    }
  }

  encodeDraw(context, uniforms, ops) {
    context.drawBuffers(this._attachments.map((attach, i) => context[`COLOR_ATTACHMENT${i}`]));

    context.bindVertexArray(ops.quad.vertexArray);
    context.drawArrays(context.TRIANGLES, 0, 6);

    this.incrementPingpong();
  }

  reduce(context, uniforms, ops = {}) {
    context.useProgram(this._program);

    this._pingpongId = 0;
    this.encodeLevel(context, -1, uniforms, ops);
    this.encodeTextures(context, -1, uniforms, ops);

    this.checkFboStatus(context);
    this.encodeDraw(context, uniforms, ops);

    for (var i = 0; i < this._levels - 1; i++) {
      this.encodeLevel(context, i, uniforms, ops);
      this.encodeTextures(context, i, uniforms, ops);

      this.checkFboStatus(context);
      this.encodeDraw(context, uniforms, ops);
    }

    context.bindFramebuffer(context.READ_FRAMEBUFFER, this._framebuffers[(this._pingpongId + 1) % 2]);

    this._values = this._attachments.reduce((acc, attach, i) => {
      var pixels = new Float32Array(4);
      var mipmap = this._mipmaps[this._mipmaps.length - 1];
      context.readBuffer(context[`COLOR_ATTACHMENT${i}`]);
      context.readPixels(mipmap.pos[0], mipmap.pos[1], 1, 1, context.RGBA, context.FLOAT, pixels);
      acc[attach.id] = pixels;
      return acc
    }, {});

    return this._values;
    // TODO: callback?
  }


  incrementPingpong() {
    this._pingpongId = (this._pingpongId + 1) % 2;
  }
}

var outputTexture = false;