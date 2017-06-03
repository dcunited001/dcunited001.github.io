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
  constructor() {

  }
}

class MipReducer {

  constructor(resolution, attachments, options = {}) {
    this._resolution = resolution;
    this._requiredUniforms = ['u_mipmapLevel'];
    this._attachments = attachments;

    var logX = Math.log2(this._resolution[0]),
      logY = Math.log2(this._resolution[1]);

    this._levels = (logX > logY ? Math.trunc(logX) + 1 : Math.trunc(logY) + 1);
    this._mipmaps = new Int32Array(this._levels - 1).reduce((mipmaps, m, i) => {
      var lastMipmap = mipmaps[i];

      var width = Math.floor(lastMipmap.x / 2),
        height = Math.floor(lastMipmap.y / 2);

      mipmaps[i+1] = {
        x: (width > 0) ? width : 1,
        y: (height > 0) ? height : 1
      };
      return mipmaps;
    }, [{x: resolution[0], y: resolution[1]}]);

    console.log(this._mipmaps);

    this._debug = options.debug;

    // TODO: after createTextures(), then:
    // - bind framebuffer
    // - clear
    // - finally generate mipmaps
  }

  configure(context, options = {}) {
    this._textures = this.createTextures(context, this._resolution);

    this._framebuffer = this.createFramebuffer(context);
    //this.createMipmaps(context);

    this.configureProgram(context);
    this.configureUniforms(context, options);

    this._samplerNearest = context.createSampler();
    context.samplerParameteri(this._samplerNearest, context.TEXTURE_MIN_FILTER, context.NEAREST);
    context.samplerParameteri(this._samplerNearest, context.TEXTURE_MAG_FILTER, context.NEAREST);
    context.samplerParameteri(this._samplerNearest, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
    context.samplerParameteri(this._samplerNearest, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);

    if (this._debug) {
      this._debugTextures = this.createTexutres(context, this._resolution);
    }
  }

  createTextures(context, resolution) {
    return this._attachments.map((attach) => {
      context.activeTexture(context.TEXTURE0);
      var tex = context.createTexture();
      context.bindTexture(context.TEXTURE_2D, tex);
      context.texStorage2D(context.TEXTURE_2D, this._levels, attach.internalFormat, resolution[0], resolution[1]);
      //context.generateMipmap(context.TEXTURE_2D); // TODO: clear first? ...
      //this._levels = context.getTexParameter(context.TEXTURE_2D, context.TEXTURE_MAX_LEVEL);
      context.bindTexture(context.TEXTURE_2D, null);

      return tex;
    });
  }

  checkFboStatus(context) {
    var status = context.checkFramebufferStatus(context.DRAW_FRAMEBUFFER);
    if (status != context.FRAMEBUFFER_COMPLETE) {
      console.error('fb status: ' + status.toString(10));
    }
  }

  createFramebuffer(context) {
    var fbo = context.createFramebuffer();
    context.bindFramebuffer(context.DRAW_FRAMEBUFFER, fbo);
    for (var i=0; i < this._textures.length; i++) {
      context.framebufferTexture2D(context.DRAW_FRAMEBUFFER, context[`COLOR_ATTACHMENT${i}`], context.TEXTURE_2D, this._textures[i], 0);
    }
    this.checkFboStatus(context);
    context.clearColor(0.0,0.0,0.0,0.0);
    context.clear(context.COLOR_BUFFER_BIT);
    context.bindFramebuffer(context.DRAW_FRAMEBUFFER, null);
    return fbo;
  }

  createMipmaps(context) {
    for (var tex of this._textures) {
      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, tex);
      context.generateMipmap(context.TEXTURE_2D);
      context.bindTexture(context.TEXTURE_2D, null);
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

    var uniforms = `
    uniform int u_mipmapLevel;
    in vec4 v_position;
    in vec2 v_st;
    `;

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
    ivec2 writeUv = ivec2(trunc(gl_FragCoord.xy));
    ivec2 readUv = writeUv * 2;
    int fetchMipmapLevel = (u_mipmapLevel == 0 ? 0 : u_mipmapLevel - 1);
    bvec2 singleFetch;
    `;

    var readAttachments = this._attachments.map((attach, i) => {
      var texels = symbols.texels(attach, i);
      var sampler = symbols.sampler(attach, i);
      var defaultValue = symbols.default(attach, i);

      return `
      vec4 ${texels}[4];

      singleFetch = equal(readUv, textureSize(${sampler}, fetchMipmapLevel));
      ${texels}[0] = texelFetch(${sampler}, readUv, fetchMipmapLevel);
      ${texels}[1] = singleFetch.x ? ${defaultValue} : texelFetch(${sampler}, readUv + ivec2(1,0), fetchMipmapLevel);
      ${texels}[2] = singleFetch.y ? ${defaultValue} : texelFetch(${sampler}, readUv + ivec2(0,1), fetchMipmapLevel);
      ${texels}[3] = any(singleFetch.xy) ? ${defaultValue} : texelFetch(${sampler}, readUv + ivec2(1,1), fetchMipmapLevel);
      `;
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
    ${uniforms}
    ${samplerUniforms}
    ${attachmentOuts}

    void main() {

    ${constructTexelCoords}
    ${readAttachments}
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

  encodeLevel(context, mipmapLevel, uniforms, ops = {}) {
    context.uniform1i(this._uniformLocations.u_mipmapLevel, mipmapLevel);

    this.encodeUniforms(context, uniforms, ops);
    this.encodeTextures(context, uniforms, ops);

    // TODO: ensure that, on the second draw, the correct textures are being bound

    this.encodeDraw(context, uniforms, ops);
  }

  prepareReduce(context, uniforms, ops = {}) {
    context.useProgram(this._program);
    context.bindFramebuffer(context.DRAW_FRAMEBUFFER, this._framebuffer);
    context.blendFunc(context.ONE, context.ZERO);
    context.viewport(0,0,this._resolution[0], this._resolution[1]);
  }

  encodeUniforms(context, uniforms, ops = {}) {

  }

  encodeTextures(context, uniforms, ops = {}) {
    for (var i = 0; i < this._attachments.length; i++) {
      var attach = this._attachments[i];
      context.activeTexture(context[`TEXTURE${i}`]);
      context.uniform1i(attach.samplerUniformLocation, i);
      context.uniform4fv(attach.samplerDefaultUniformLocation, attach.defaultValue);
      context.bindTexture(context.TEXTURE_2D, ops[attach.id]);
      context.bindSampler(i, this._samplerNearest);
    }
  }

  encodeDraw(context, uniforms, ops) {
    context.drawBuffers(this._textures.map((tex, i) => context[`COLOR_ATTACHMENT${i}`]));

    context.bindVertexArray(ops.quad.vertexArray);
    context.drawArrays(context.TRIANGLES, 0, 6);
  }

  updateFramebufferMipmaps(context, mipmapLevel) {
    for (var i=0; i < this._textures.length; i++) {
      context.framebufferTexture2D(context.DRAW_FRAMEBUFFER, context[`COLOR_ATTACHMENT${i}`], context.TEXTURE_2D, this._textures[i], mipmapLevel);
    }
    this.checkFboStatus(context);
  }

  reduce(context, uniforms, ops = {}) {
    this.prepareReduce(context, uniforms, ops);

    // reading from the initial textures
    // - reading (level: 0) writing (level: 0)
    this.encodeLevel(context, 0, uniforms, ops);

    // TODO: binding [Texture 28] for [Attachment 0] (incorrect)
    // - but binding [Texture 53] for [Attachment 1]
    // - this reduce/merge is incorrect

    var attachTextures = this._attachments.reduce((acc, attach, i) => {
      acc[attach.id] = this._textures[i];
      return acc
    }, {});

    var ops = Object.assign({}, ops, attachTextures);

    context.bindFramebuffer(context.READ_FRAMEBUFFER, this._framebuffer);
    var debugPixels = new Float32Array(16);
    context.readBuffer(context.COLOR_ATTACHMENT0);

    context.readPixels(0, 0, 2, 2, context.RGBA, context.FLOAT, debugPixels);
    console.log(`MomentumSum 0`, debugPixels);
    console.log(debugPixels[0], debugPixels[4], debugPixels[8], debugPixels[12]);
    context.readBuffer(context.COLOR_ATTACHMENT1);
    context.readPixels(0, 0, 2, 2, context.RGBA, context.FLOAT, debugPixels);
    console.log(`MomentumMinMax 0`, debugPixels);
    console.log(debugPixels[0], debugPixels[4], debugPixels[8], debugPixels[12]);

    for (var i = 1; i < this._levels; i++) {
      // - reading (level: 0) writing (level: 1)
        // - reading (level: 1) writing (level: 2)
      this.updateFramebufferMipmaps(context, i);
      this.encodeLevel(context, i - 1, uniforms, ops);

      context.bindFramebuffer(context.READ_FRAMEBUFFER, this._framebuffer);
      var debugPixels = new Float32Array(16);
      var readPixels = ((i == this._levels - 1) ? 1 : 2);

      context.readBuffer(context.COLOR_ATTACHMENT0);
      context.readPixels(0, 0, readPixels, readPixels, context.RGBA, context.FLOAT, debugPixels);
      console.log(`MomentumSum ${i}`, debugPixels);
      console.log(debugPixels[0], debugPixels[4], debugPixels[8], debugPixels[12]);
      context.readBuffer(context.COLOR_ATTACHMENT1);
      context.readPixels(0, 0, readPixels, readPixels, context.RGBA, context.FLOAT, debugPixels);
      console.log(`MomentumMinMax ${i}`, debugPixels);
    }

    //context.bindFramebuffer(context.DRAW_FRAMEBUFFER, null);
    //context.bindFramebuffer(context.READ_FRAMEBUFFER, this._framebuffer);
    //context.readBuffer(context.COLOR_ATTACHMENT0);
    //var debugPixels = new Float32Array(4);
    //context.readPixels(0, 0, 1, 1, context.RGBA, context.FLOAT, debugPixels);
    //context.readBuffer(context.COLOR_ATTACHMENT0);
  }



}
