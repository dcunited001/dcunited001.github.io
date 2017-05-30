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

class MipReducer {

  constructor(resolution, attachmentsConfig, options) {
    this._resolution = resolution;
    //this._baseResolution = vec2.fromValues(resolution[0], resolution[1] * 2);

    var logX = Math.log2(resolution[0]);
    var logY = Math.log2(resolution[1]);

    this._levels = options._levels || (logX > logY ? Math.trunc(logX) : Math.trunc(logY));
    this._mipmaps = generateMipmaps(resolution, this._levels);

    console.log(this._mipmaps);

    this._attachmentsConfig = attachmentsConfig;
    this._requiredUniforms = ['u_readMipmapOffset', 'u_readMipmapSize', 'u_writeMipmapOffset', 'u_writeMipmapSize'];
  }

  configure(context, options = {}) {
    this._textures = createTextures(context, this._resolution);
    this._framebuffer = createFramebuffer(context);
    this.configureProgram(context);
    this.configureUniforms(context, options);
    this._samplerNearest = context.createSampler();
    context.samplerParameteri(samplerNearest, context.TEXTURE_MIN_FILTER, context.NEAREST);
    context.samplerParameteri(samplerNearest, context.TEXTURE_MAG_FILTER, context.NEAREST);
    context.samplerParameteri(samplerNearest, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
    context.samplerParameteri(samplerNearest, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
  }

  createTextures(context, resolution) {
    return attachmentsConfig.map((attach) => {
      context.activeTexture(context.TEXTURE0);
      var tex = context.createTexture();
      context.bindTexture(context.TEXTURE_2D, tex);
      context.texStorage2D(context.TEXTURE_2D, 1, attach.internalFormat, resolution[0], resolution[1]);
      context.bindTexture(context.TEXTURE_2D, null);

      return tex;
    });
  }

  createFramebuffer(context) {
    var fbo = context.createFramebuffer();
    context.bindFramebuffer(context.DRAW_FRAMEBUFFER, fbo);
    for (var i=0; i < this._textures.length; i++) {
      context.framebufferTexture2D(context.DRAW_FRAMEBUFFER, context[`COLOR_ATTACHMENT${i}`], context.TEXTURE_2D, this._textures[i]);
    }
    context.bindFramebuffer(context.DRAW_FRAMEBUFFER, null);
  }

  generateMipmaps(resolution, levels) {
    var firstLevel = {
      pos: vec2.fromValues(0,0),
      res: vec2.fromValues(Math.ceil(resolution[0] / 2), Math.ceil(resolution[1] / 2))
    };

    return new Int32Array(levels - 1).reduce((mips, level, i) => {
      var pos, res;
      if (i % 2 == 0) {
        pos = mips[i].pos + vec2.fromValues(mips[i].res[0], 0);
      } else {
        pos = mips[i].pos + vec2.fromValues(0, mips[i].res[1]);
      }

      // each level is half the size
      res = vec2.fromValues(
        Math.ceil(mips[i].res[0] / 2),
        Math.ceil(mips[i].res[1] / 2)); // Math.round is incorrect for non-power-of-two

      mips[i+1] = { pos: pos, res: res };
      return mips
    }, [firstLevel]);
  }

  fragmentShaderSymbols() {
    return {
      sampler: function (attachment, i) {
        return `s_attachment${attachment.id || i}; `
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
    var symbols = fragmentShaderSymbols();

    var uniforms = "uniform ivec2 u_readMipmapSize;\n" +
      "uniform ivec2 u_readMipmapOffset;\n" +
      "uniform ivec2 u_writeMipmapSize;\n" +
      "uniform ivec2 u_writeMipmapOffset;\n" +
      "in vec4 v_position;\n";

    var samplerUniforms = this._attachmentsConfig.map((attach, i) => {
      var attachSampler = symbols.sampler(attach, i);

      return `uniform sampler2D ${attachSampler};`
    }).join("\n");

    var attachmentOuts = this._attachmentsConfig.map((attach, i) => {
      var attachOutput = symbols.output(attach, i);

      return `layout(location = ${i}) out vec4 ${attachOutput};`
    }).join("\n");

    var constructTexelCoords = "ivec2 writeUv = ivec2(trunc(gl_FragCoord.xy)) - u_writeMipmapOffset;\n" +
        "ivec2 readUv = u_readMipmapOffset + writeUv * 2;\n";

    var readAttachments = this._attachmentsConfig.map((attach, i) => {
      var attachTexels = symbols.texels(attach, i);
      var attachSampler = symbols.sampler(attach, i);

      return `vec4 ${attachTexels}[4];\n` +
      `${attachTexels}[0] = texelFetch(${attachSampler}, readUv, 0);\n` +
      `${attachTexels}[1] = texelFetch(${attachSampler}, readUv + ivec(1,0), 0);\n` +
      `${attachTexels}[2] = texelFetch(${attachSampler}, readUv + ivec(0,1), 0);\n` +
      `${attachTexels}[3] = texelFetch(${attachSampler}, readUv + ivec(1,1), 0);\n`;
    });

    var calcAttachments = this._attachmentsConfig.map((attach, i) => {
      var texels = symbols.texels(attach, i);
      var sampler = symbols.sampler(attach, i);

      if (attach.calc) {
        return eval("`" + attach.calc + "`");
      } else {
        return "\n"
      }
    });

    var writeAttachments = this._attachmentsConfig.map((attach, i) => {
      var attachOutput = symbols.output(attach, i);

      return `${attachOutput} = ${attach.write};\n`
    });

    return uniforms + "\n\n" +
      samplerUniforms + "\n\n" +
      attachmentOuts  + "\n\n" +
      constructTexelCoords + "\n\n" +
      readAttachments  + "\n\n" +
      calcAttachments  + "\n\n" +
      writeAttachments +  "\n\n";
  }

  configureProgram(context) {
    var prefix = "#version 300 es\n" +
      "extension EXT_color_buffer_float : enable\n\n";

    var precision = "precision highp float;\n" +
      "precision highp int;\n" +
      "precision highp sampler2D;\n" +
      "precision highp usampler2D;\n" +
      "precision highp isampler2D;\n\n";

    var vsPassSource = "layout(location = 0) in vec3 a_position;\n" +
      "layout(location = 1) in vec2 a_texcoord;\n" +
      "out vec2 v_st;\n" +
      "out vec3 v_position;\n" +
      "void main() {\n" +
      "  v_st = a_texcoord;\n" +
      "  v_position = a_position;\n" +
      "  gl_Position = vec4(a_position, 1.0);\n" +
      "}\n";

    var program = gl.createProgram();
    var vertexShaderSource = prefix + precision + vsPassSource;
    var fragmentShaderSource = prefix + precision + generateFragmentShaderSource();

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
    var symbols = fragmentShaderSymbols();
    var samplerNames =

    var uniforms = this._requireUniforms.concat(options.uniforms || []);
    this._uniformLocations = uniforms.reduce((acc, name) => {
      acc[name] = context.getUniformLocation(this._program, name);
    }, {});

    for (var i = 0; i < this._attachmentsConfig.length; i++ ) {
      var attach = this._attachmentsConfig[i];
      attach[i].samplerName = symbols.sampler(attach, i);
      attach[i].samplerUniformLocation = context.getUniformLocation(this._program, name);
    }
  }

  encodeLevel(context, mipmapLevel, uniforms, options = {}) {
    encodeUniforms(context, uniforms, options);
    encodeTextures(context, uniforms, options);

    var pos = this._mipmaps[mipmapLevel].pos;
    var res = this._mipmaps[mipmapLevel].res;
    context.scissor(pos[0], pos[1], res[0], res[1]);

    encodeDraw(context, uniforms, ops);
  }

  prepareReduce(context, uniforms, ops = {}) {
    context.bindFramebuffer(context.DRAW_FRAMEBUFFER, this._framebuffer);
    context.blendFunc(context.ONE, context.ZERO);
    context.viewport(0,0,this._resolution[0], this,resolution[1]);
  }

  encodeUniforms(context, uniforms, ops = {}) {
    context.uniform2iv(this._uniformLocations.u_readMipmapOffset, uniforms.readMipmapOffset);
    context.uniform2iv(this._uniformLocations.u_readMipmapSize, uniforms.readMipmapSize);
    context.uniform2iv(this._uniformLocations.u_writeMipmapOffset, uniforms.writeMipmapOffset);
    context.uniform2iv(this._uniformLocations.u_writeMipmapSize, uniforms.writeMipmapSize);
  }

  encodeTextures(context, uniforms, ops = {}) {
    for (var i = 0; i < this._attachmentsConfig.length; i++) {
      var attach = this._attachmentsConfig[i];
      context.activeTexture(context[`TEXTURE${i}`]);
      context.uniform1i(attach.samplerUniformLocation, i);
      context.bindTexture(context.TEXTURE_2D, ops[attach.id]);
      context.bindSampler(i, this._samplerNearest);
    }
  }

  encodeDraw(context, uniforms, ops) {
    context.drawBuffers(this._textures.map((tex, i) => context[`COLOR_ATTACHMENT${i}`]));

    context.bindVertexArray(ops.quad.vertexArray);
    context.drawArrays(context.TRIANGLES, 0, 6);
  }

  reduce(context, uniforms, ops = {}) {
    prepareReduce(context, uniforms, ops);

    // encode level 0
    // - use texture references passed in from ops

    // encode mipmap level 1 - n
    // - use texture references on this object (may have to pingpong...)
  }

}
