import { MipReducerAttachment, MipReducer } from '../../lib/MipReducer.js';
import { Quad } from '../../lib/Quad.js';
import { LinePlot } from '../../lib/LinePlot.js';

"use strict";

function createShader(gl, source, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

window.createProgram = function (gl, vertexShaderSource, fragmentShaderSource, options = {}) {
  var defines = options.defines || {};

  var shaderPrefix = "#version 300 es\n";
  shaderPrefix += "#extension EXT_color_buffer_float : enable\n";
  shaderPrefix += "#extension OES_texture_float_linear: enable\n";

  var precisionPrefix = `
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    precision highp usampler2D;
    precision highp isampler2D;
    `;

  vertexShaderSource = shaderPrefix + expandDefines(defines) + precisionPrefix + vertexShaderSource;
  fragmentShaderSource = shaderPrefix + expandDefines(defines) + precisionPrefix + fragmentShaderSource;

  var program = gl.createProgram();
  var vshader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  var fshader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  gl.attachShader(program, vshader);
  gl.deleteShader(vshader);
  gl.attachShader(program, fshader);
  gl.deleteShader(fshader);

  if (options.beforeLink) {
    options.beforeLink(gl, program);
  }

  gl.linkProgram(program);

  var log = gl.getProgramInfoLog(program);
  if (log) {
    console.log(log);
  }

  log = gl.getShaderInfoLog(vshader);
  if (log) {
    console.log(log);
  }

  log = gl.getShaderInfoLog(fshader);
  if (log) {
    console.log(log);
  }

  return program;
};

window.expandDefines = function (defines = {}) {
  // TODO: fix this?
  var defineStrings = "";
  if (defines.keys !== undefined) {
    for (var k in Object.keys(defines)) {
      defineStrings += `#define ${k} ${defines[k]}\n`;
    }
  }

  return defineStrings;
};

function runWebGL() {

  function updateTime() {
    lastFrameStart = currentTime;
    currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    simulationTime += (paused ? 0 : elapsedTime);
    lastFrameTime = currentTime - lastFrameStart;
  }

  function updateDeltaT(dt, newDeltaT) {
    return vec4.fromValues(newDeltaT, dt[0], dt[1], dt[2]);
  }

// =======================================
// Generate Texture Data
// =======================================

  function generateFloat32Randoms(w, h, n, max = 1, min = 0) {
    var randoms = new Float32Array(w * h * n);
    var range = max - min;
    var mid = min + range/2;
    for (var i = 0; i < (w * h * n); i++) {
      randoms[i] = Math.random() * range + min;
    }
    return randoms
  }

  function generateInt32Randoms(w, h, n) {
    var randoms = new Int32Array(w * h * n);
    for (var i = 0; i < (w * h * n); i++) {
      randoms[i] = Math.trunc(Math.random() * UINT32_MAX - INT32_MAX);
    }
    return randoms
  }

  function generateParticleIndices(h, w) {
    var indices = new Int32Array(h * w);
    for (var i = 0; i < (h * w); i++) {
      indices[i] = i;
    }
    return indices;
  }

  function makeIntRandomUniforms() {
    return new Int32Array([
      Math.trunc(Math.random() * UINT32_MAX - INT32_MAX),
      Math.trunc(Math.random() * UINT32_MAX - INT32_MAX),
      Math.trunc(Math.random() * UINT32_MAX - INT32_MAX),
      Math.trunc(Math.random() * UINT32_MAX - INT32_MAX)
    ]);
  }

// =======================================
// Geometry
// =======================================

  class RenderPass {
    constructor(program, options = {}) {
      this._program = program;
      this._uniformLocations = {};
      this._options = options;
    }

    get program() { return this._program; }
    set program(program) { this._program = program; }
    get options() { return this._options; }
    set options(options) { this._options = options; }

    get uniformLocations() {
      return this._uniformLocations;
    }

    set uniformLocations(uniformLocations) {
      this._uniformLocations = uniformLocations;
    }

    setUniformLocations(context, keys) {
      var uniformLocations = {};
      for (var k of keys) {
        uniformLocations[k] = context.getUniformLocation(this.program, k);
      }
      this._uniformLocations = uniformLocations;
    }

    encode(context, uniforms, options = {}) {
      var ops = Object.assign({}, this.options, options);

      context.useProgram(ops.program || this.program);

      // for each key in uniforms, encode value into the specific location
      if (ops.beforeEncode !== undefined) {
        ops.beforeEncode(context, uniforms, ops);
      }

      if (ops.encodeUniforms !== undefined) {
        ops.encodeUniforms(context, uniforms, ops);
      } else {
        this.encodeUniforms(context, uniforms, ops);
      }

      if (ops.encodeTextures !== undefined) {
        ops.encodeTextures(context, uniforms, ops);
      }

      if (ops.encodeClear !== undefined) {
        ops.encodeClear(context, uniforms, ops);
      }

      this.checkFboStatus(context);

      if (ops.encodeDraw !== undefined) {
        ops.encodeDraw(context, uniforms, ops);
      } else {
        this.encodeDraw(context, uniforms, ops);
      }

      if (ops.afterEncode !== undefined) {
        ops.afterEncode(context, uniforms, ops);
      }

      this.cleanupEncode(context);
    }

    encodeUniforms(c, uniforms, options = {}) {
      console.error("RenderPass: override encodeUniforms() or pass 'encodeUniforms'")
    }

    encodeDraw(c, uniforms, options = {}) {
      console.error("RenderPass: override encodeDraw() or pass 'encodeDraw'")
    }

    cleanupEncode(context) {
      context.bindBuffer(context.ARRAY_BUFFER, null);
      context.bindVertexArray(null);
      context.useProgram(null);
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, null);
    }

    checkFboStatus(context) {
      var status = context.checkFramebufferStatus(context.DRAW_FRAMEBUFFER);
      if (status != context.FRAMEBUFFER_COMPLETE) {
        console.error('fb status: ' + status.toString(10));
      }
    }
  }

// =======================================
// PingPongProvider
// =======================================

  class PingPongProvider {
    constructor (options = {}) {
      this._current = 0;
      this._textures = {};
      this._framebuffers = [];
      this._max = options.max || 2;
    }

    initFramebuffers(context, fboConfig) {
      for (var i = 0; i < this._max; i++) {
        var newFbo = context.createFramebuffer();
        context.bindFramebuffer(context.DRAW_FRAMEBUFFER, newFbo);
        for (var k in fboConfig) {
          context.framebufferTexture2D(context.DRAW_FRAMEBUFFER, fboConfig[k].colorAttachment, context.TEXTURE_2D, this.getNext(k), 0);
        }
        context.bindFramebuffer(context.DRAW_FRAMEBUFFER, null);
        this._framebuffers.push(newFbo);
        this.increment();
      }
    }

    registerTextures(k, texturesOrMonoid) {
      this._textures[k] = texturesOrMonoid;
    }

    getTexture(k, i, ...args) {
      var textures = this._textures[k];
      if (textures === undefined) {
        console.error(`PingPongProvider: key ${k} is undefined`);
      } else {
        if (textures instanceof Array) {
          return textures[i];
        } else {
          // TODO: decide whether to pass `this`
          // return textures(this, i, ...args);
          return textures(...args);
        }
      }
    }

    getCurrent(k, ...args) {
      var id = this.getCurrentId();
      return this.getTexture(k, id, ...args);
    }

    getNext(k,  ...args) {
      var id = this.getNextId();
      return this.getTexture(k, id, ...args);
    }

    getPrev(k, ...args) {
      var id = this.getPrevId();
      return this.getTexture(k, id, ...args);
    }

    getCurrentFbo() {
      // TODO: may need to fix the id...
      return this._framebuffers[this.getCurrentId()];
    }

    getCurrentId() {
      return this._current;
    }

    getNextId() {
      if (this._current == this._max - 1) {
        return 0;
      } else {
        return this._current + 1;
      }
    }

    getPrevId() {
      if (this._current == 0) {
        return this._max - 1;
      } else {
        return this._current - 1;
      }
    }

    increment() {
      if (this._current == this._max - 1) {
        this._current = 0;
      } else {
        this._current++;
      }
    }
  }

// =======================================
// Canvas & WebGL
// =======================================

  var canvas = document.getElementById('main-canvas');
  canvas.style.width = '100%';
  canvas.height = 500;
  canvas.width = canvas.offsetWidth;

  var gl = canvas.getContext('webgl2', {antialias: true});
  var colorBufferFloatExt = gl.getExtension('EXT_color_buffer_float');
  if (!colorBufferFloatExt) {
    console.error("EXT_color_buffer_float not supported.")
  }

  var isWebGL2 = !!gl;
  if (!isWebGL2) {
    document.getElementById('info').innerHTML = 'WebGL 2 is not available.  See <a href="https://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">How to get a WebGL 2 implementation</a>';
    console.error('WebGL 2 is not available.')
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);

  var UINT32_MAX = (2 ** 32) - 1;
  var INT32_MAX = (2 ** 31) - 1;

// =======================================
// GLSL Programs
// =======================================

  var programParticles = createProgram(gl,
    document.getElementById('vsPass').textContent,
    document.getElementById('fsUpdateParticles').textContent);

  var programForceSplat = createProgram(gl,
    document.getElementById('vsPass').textContent,
    document.getElementById('fsForceSplat').textContent);

  var programFields = createProgram(gl,
    document.getElementById('vsFields').textContent,
    document.getElementById('fsFields').textContent);

  var programGradients = createProgram(gl,
    document.getElementById('vsPass').textContent,
    document.getElementById('fsGradients').textContent);

  var programRenderFields = createProgram(gl,
    document.getElementById('vsPass').textContent,
    document.getElementById('fsRenderFields').textContent);

  var programLinePlotTransform = createProgram(gl,
    document.getElementById('vsLinePlotTransform').textContent,
    document.getElementById('fsNull').textContent,
    {
      beforeLink: (context, program) => {
        var varyings = ['v_positionA', 'v_positionB'];
        context.transformFeedbackVaryings(program, varyings, context.INTERLEAVED_ATTRIBS);
      }
    });

  var programLinePlot = createProgram(gl,
    document.getElementById('vsLinePlot').textContent,
    document.getElementById('fsLinePlot').textContent);

// =======================================
// Particles
// =======================================

  var PARTICLE_MAX = parseInt(document.getElementById('particle-count').max);
  var PARTICLE_WIDTH = 32;
  var particleResolution = vec2.fromValues(PARTICLE_WIDTH, PARTICLE_MAX/PARTICLE_WIDTH);
  var renderResolution = vec2.fromValues(gl.drawingBufferWidth, gl.drawingBufferHeight);

  var particleIdx = generateParticleIndices(particleResolution[0], particleResolution[1]);

  var particleIdxBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, particleIdxBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, particleIdx, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var particleVertexArray = gl.createVertexArray();
  gl.bindVertexArray(particleVertexArray);

  var particleIdxIndex = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, particleIdxBuffer);
  gl.vertexAttribIPointer(particleIdxIndex, 1, gl.INT, false, 0, 0);
  gl.enableVertexAttribArray(particleIdxIndex);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.bindVertexArray(null);

  var particlePonger = new PingPongProvider({max: 3});

  var particleRandomsAttachments,
    particleAttachments,
    particleMomentums,
    particleForces;

  particleRandomsAttachments = [0,1,2].map((f) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32I, particleResolution[0], particleResolution[1]);
    gl.texSubImage2D(gl.TEXTURE_2D,
      0,
      0, // x offset
      0, // y offset
      particleResolution[0],
      particleResolution[1],
      gl.RGBA_INTEGER,
      gl.INT,
      generateInt32Randoms(particleResolution[0], particleResolution[1], 4));

    // TODO: load random seeds from image
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex
  });

  particleAttachments = [0,1,2].map((f) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, particleResolution[0], particleResolution[1]);
    gl.texSubImage2D(gl.TEXTURE_2D,
      0,
      0, // x offset
      0, // y offset
      particleResolution[0],
      particleResolution[1],
      gl.RGBA,
      gl.FLOAT,
      generateFloat32Randoms(particleResolution[0], particleResolution[1], 4, -0.5, 0.5));

    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  });

  particleMomentums = [0,1,2].map((f) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, particleResolution[0], particleResolution[1]);
    gl.texSubImage2D(gl.TEXTURE_2D,
      0,
      0, // x offset
      0, // y offset
      particleResolution[0],
      particleResolution[1],
      gl.RGBA,
      gl.FLOAT,
      generateFloat32Randoms(particleResolution[0], particleResolution[1], 4, -0.05, 0.05)
    );

    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  });

  particleForces = [0,1,2].map((f) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, particleResolution[0], particleResolution[1]);
    gl.texSubImage2D(gl.TEXTURE_2D,
      0,
      0, // x offset
      0, // y offset
      particleResolution[0],
      particleResolution[1],
      gl.RGBA,
      gl.FLOAT,
      new Float32Array(particleResolution[0] * particleResolution[1] * 4)
    );

    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  });

  particlePonger.registerTextures('particleRandoms', particleRandomsAttachments);
  particlePonger.registerTextures('particles', particleAttachments);
  particlePonger.registerTextures('particleMomentums', particleMomentums);
  particlePonger.registerTextures('particleForces', particleForces);

  var particleFboConfig = {
    particleRandoms: {
      colorAttachment: gl.COLOR_ATTACHMENT0
    },
    particles: {
      colorAttachment: gl.COLOR_ATTACHMENT1
    },
    particleMomentums: {
      colorAttachment: gl.COLOR_ATTACHMENT2
    },
    particleForces: {
      colorAttachment: gl.COLOR_ATTACHMENT3
    }
  };

  particlePonger.initFramebuffers(gl, particleFboConfig);

// =======================================
// Force Splatting Texture
// =======================================

  gl.activeTexture(gl.TEXTURE0);
  var forceSplatTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, forceSplatTexture);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, particleResolution[0], particleResolution[1]);
  gl.bindTexture(gl.TEXTURE_2D, null);

  var forceSplatFbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, forceSplatFbo);
  gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, forceSplatTexture, 0);
  gl.clearColor(0.0,0.0,0.0,0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);

// =======================================
// Aggregate Filter Textures
// =======================================

// TODO: limit particles for aggregate calculations to particleCount
//gl.activeTexture(gl.TEXTURE0);
//var aggregateTextures = ['momentum', 'deltaMomentum', 'force', 'deltaForce'].reduce((acc, k) => {
//  var tex = gl.createTexture();
//  gl.bindTexture(gl.TEXTURE_2D, tex);
//  aggregateTextures.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, particleResolution[0], particleResolution[1]);
//  acc[k] = tex;
//  return acc
//});
//gl.bindTexture(gl.TEXTURE_2D, null);

// =======================================
// Fields & Gradients
// =======================================

  var fieldPonger = new PingPongProvider({max: 3});
  var fieldRForceAttachments, fieldRForceGradientAttachments;

  fieldRForceAttachments = [0,1,2].map((i) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, renderResolution[0], renderResolution[1]);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  });

  fieldRForceGradientAttachments = [0,1,2].map((i) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, renderResolution[0], renderResolution[1]);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  });

  fieldPonger.registerTextures('repelField', fieldRForceAttachments);
  fieldPonger.registerTextures('repelFieldGradient', fieldRForceGradientAttachments);

  var fieldPongerFboConfig = {
    repelField: { colorAttachment: gl.COLOR_ATTACHMENT0 },
    repelFieldGradient: { colorAttachment: gl.COLOR_ATTACHMENT1 }
  };

  fieldPonger.initFramebuffers(gl, fieldPongerFboConfig);
  for (var i in fieldPonger._framebuffers) {
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fieldPonger._framebuffers[i]);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  };

// =======================================
// Gradients
// =======================================

  var gradientPonger = new PingPongProvider({max: 3});
  var gradientRForceAttachments;

  gradientRForceAttachments = [0,1,2].map((i) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, renderResolution[0], renderResolution[1]);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  });

  gradientPonger.registerTextures('repelFieldGradient', gradientRForceAttachments);

  var gradientPongerFboConfig = {
    repelFieldGradient: { colorAttachment: gl.COLOR_ATTACHMENT0 }
  };

  gradientPonger.initFramebuffers(gl, gradientPongerFboConfig);
  for (var i in gradientPonger._framebuffers) {
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, gradientPonger._framebuffers[i]);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  };

// =======================================
// Texture Samplers
// =======================================

  var samplerNearest = gl.createSampler();
  gl.samplerParameteri(samplerNearest, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.samplerParameteri(samplerNearest, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.samplerParameteri(samplerNearest, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.samplerParameteri(samplerNearest, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

// =======================================
// Render Pass: Particles
// =======================================

  var rpParticles = new RenderPass(programParticles, {
    beforeEncode: (context, uniforms, ops) => {
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, ops.framebuffer);
      context.blendFunc(context.ONE, context.ZERO);
      context.viewport(0, 0, uniforms.resolution[0], uniforms.resolution[1]);
    },
    encodeUniforms: (context, uniforms, ops) => {
      context.uniform2fv(rpParticles.uniformLocations.u_resolution, uniforms.resolution);
      context.uniform2fv(rpParticles.uniformLocations.u_fieldResolution, uniforms.fieldResolution);
      context.uniform4iv(rpParticles.uniformLocations.u_randomSeed, uniforms.randomSeed);
      context.uniform1f(rpParticles.uniformLocations.u_particleSpeed, uniforms.particleSpeed);
      context.uniform4fv(rpParticles.uniformLocations.u_deltaTime, uniforms.deltaTime);
      context.uniform1i(rpParticles.uniformLocations.u_physicsMethod, uniforms.physicsMethod);
      context.uniform1i(rpParticles.uniformLocations.u_spaceType, uniforms.spaceType);
      context.uniform1i(rpParticles.uniformLocations.s_particleRandoms, 0);
      context.uniform1i(rpParticles.uniformLocations.s_particles, 1);
      context.uniform1i(rpParticles.uniformLocations.s_particleMomentums, 2);
      context.uniform1i(rpParticles.uniformLocations.s_particleForceSplat, 3);
      context.uniform1i(rpParticles.uniformLocations.s_repelField, 4);
    },
    encodeTextures: (context, uniforms, ops) => {
      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, ops.particleRandoms);
      context.bindSampler(0, samplerNearest);

      context.activeTexture(context.TEXTURE1);
      context.bindTexture(context.TEXTURE_2D, ops.particles);
      context.bindSampler(1, samplerNearest);

      context.activeTexture(context.TEXTURE2);
      context.bindTexture(context.TEXTURE_2D, ops.particleMomentums);
      context.bindSampler(2, samplerNearest);

      context.activeTexture(context.TEXTURE3);
      context.bindTexture(context.TEXTURE_2D, ops.particleForceSplat);
      context.bindSampler(3, samplerNearest);

      context.activeTexture(context.TEXTURE4);
      context.bindTexture(context.TEXTURE_2D, ops.repelField);
      context.bindSampler(4, samplerNearest);
    },
    encodeDraw: (context, uniforms, ops) => {
      context.drawBuffers([
        context.COLOR_ATTACHMENT0,
        context.COLOR_ATTACHMENT1,
        context.COLOR_ATTACHMENT2,
        context.COLOR_ATTACHMENT3
      ]);

      context.bindVertexArray(anyQuad.vertexArray);
      context.drawArrays(context.TRIANGLES, 0, 6);
    }
  });

  rpParticles.setUniformLocations(gl, [
    'u_resolution',
    'u_fieldResolution',
    'u_randomSeed',
    'u_particleSpeed',
    'u_deltaTime',
    'u_physicsMethod',
    'u_spaceType',
    's_particleRandoms',
    's_particles',
    's_particleMomentums',
    's_particleForceSplat',
    's_repelField'
  ]);

// =======================================
// Render Pass: Force Splatting
// =======================================

  var rpForceSplat = new RenderPass(programForceSplat, {
    beforeEncode: (context, uniforms, ops) => {
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, ops.framebuffer);
      context.blendFunc(context.ONE, context.ONE);
      context.viewport(0, 0, uniforms.resolution[0], uniforms.resolution[1]);
      context.clearColor(0.0,0.0,0.0,0.0);
      context.clear(gl.COLOR_BUFFER_BIT);
    },
    encodeUniforms: (context, uniforms, ops) => {
      context.uniform2fv(rpForceSplat.uniformLocations.u_resolution, uniforms.resolution);
      context.uniform1f(rpForceSplat.uniformLocations.u_rCoefficient, uniforms.rCoefficient);
      context.uniform1i(rpForceSplat.uniformLocations.u_particleIdLimit, uniforms.particleIdLimit);
      context.uniform1i(rpForceSplat.uniformLocations.s_particles, 0);
    },
    encodeTextures: (context, uniforms, ops) => {
      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, ops.particles);
      context.bindSampler(0, samplerNearest);
    },
    encodeDraw: (context, uniforms, ops) => {
      context.drawBuffers([
        context.COLOR_ATTACHMENT0
      ]);

      for (var i = 0; i < ops.particleCount; i++) {
        var particleUv = [i % particleResolution[0], Math.trunc(i / particleResolution[1])];
        context.uniform2iv(rpForceSplat.uniformLocations.u_particleUv, particleUv);
        context.bindVertexArray(anyQuad.vertexArray);
        context.drawArrays(context.TRIANGLES, 0, 6);
      }
    }
  });

  rpForceSplat.setUniformLocations(gl, [
    'u_resolution',
    'u_particleUv',
    'u_rCoefficient',
    'u_particleIdLimit',
    's_particles'
  ]);

// =======================================
// Render Pass: Fields
// =======================================

  var rpFields = new RenderPass(programFields, {
    beforeEncode: (context, uniforms, ops) => {
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, ops.framebuffer);
      context.blendFunc(context.ONE, context.ONE);
      context.viewport(0, 0, uniforms.resolution[0], uniforms.resolution[1]);
    },
    encodeClear: (context, uniforms, ops) => {
      context.clearColor(0.0, 0.0, 0.0, 1.0);
      context.clear(context.COLOR_BUFFER_BIT);
    },
    encodeUniforms: (context, uniforms, ops) => {
      context.uniform2fv(rpFields.uniformLocations.u_resolution, uniforms.resolution);
      context.uniform1f(rpFields.uniformLocations.u_fieldSize, uniforms.fieldSize);
      context.uniform1f(rpFields.uniformLocations.u_rCoefficient, uniforms.rCoefficient);
      context.uniform1f(rpFields.uniformLocations.u_fieldMinFactor, uniforms.fieldMinFactor);
      context.uniform1i(rpFields.uniformLocations.u_deferGradientCalc, (uniforms.deferGradientCalc ? 1 : 0));
      context.uniform1i(rpFields.uniformLocations.u_circularFieldEffect, (uniforms.circularFieldEffect ? 1 : 0));
      context.uniform1i(rpFields.uniformLocations.u_forceCalcInGlPointSpace, (uniforms.forceCalcInGlPointSpace ? 1 : 0));
      context.uniform1i(rpFields.uniformLocations.s_particles, 0);
    },
    encodeTextures: (context, uniforms, ops) => {
      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, ops.particles);
      context.bindSampler(0, samplerNearest);

      // TODO: add particleMomentums texture (any need for color here?)
      // - or should i add a frequency that the particles' fields resonate at?
    },
    encodeDraw: (context, uniforms, ops) => {
      context.drawBuffers([
        context.COLOR_ATTACHMENT0,
        context.COLOR_ATTACHMENT1
      ]);

      context.bindVertexArray(particleVertexArray);
      context.drawArrays(context.POINTS, 0, ops.particleCount);
    }
  });

  rpFields.setUniformLocations(gl, [
    'u_resolution',
    'u_fieldSize',
    'u_rCoefficient',
    'u_fieldMinFactor',
    's_particles',
    'u_deferGradientCalc',
    'u_circularFieldEffect',
    'u_forceCalcInGlPointSpace'
  ]);

// =======================================
// Render Pass: Gradients
// =======================================

  var rpGradients = new RenderPass(programGradients, {
    beforeEncode: (context, uniforms, ops) => {
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, ops.framebuffer);
      context.blendFunc(context.ONE, context.ZERO);
      context.viewport(0, 0, uniforms.resolution[0], uniforms.resolution[1]);
    },
    encodeClear: (context, uniforms, ops) => {
      context.clearColor(0.0, 0.0, 0.0, 1.0);
      context.clear(context.COLOR_BUFFER_BIT);
    },
    encodeUniforms: (context, uniforms, ops) => {
      context.uniform2fv(rpGradients.uniformLocations.u_resolution, uniforms.resolution);
      context.uniform1i(rpGradients.uniformLocations.s_repelField, 0);
    },
    encodeTextures: (context, uniforms, ops) => {
      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, ops.repelField);
      context.bindSampler(0, samplerNearest);
    },
    encodeDraw: (context, uniforms, ops) => {
      context.drawBuffers([
        context.COLOR_ATTACHMENT0
      ]);

      context.bindVertexArray(anyQuad.vertexArray);
      context.drawArrays(context.TRIANGLES, 0, 6);
    }
  });

  rpGradients.setUniformLocations(gl, [
    'u_resolution',
    's_repelField'
  ]);

// =======================================
// Render Pass: Fields
// =======================================

  var rpRenderFields = new RenderPass(programRenderFields, {
    beforeEncode: (context, uniforms, ops) => {
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, ops.framebuffer);
      context.blendFunc(context.ONE, context.ZERO);
      context.viewport(0, 0, uniforms.resolution[0], uniforms.resolution[1]);
      context.clearColor(0.0, 0.0, 0.0, 1.0);
      context.clear(context.COLOR_BUFFER_BIT);
    },
    encodeUniforms: (context, uniforms, ops) => {
      context.uniform2fv(rpRenderFields.uniformLocations.u_resolution, uniforms.resolution);
      context.uniform1f(rpRenderFields.uniformLocations.u_rCoefficient, uniforms.rCoefficient);
      context.uniform1i(rpRenderFields.uniformLocations.u_fractRenderValues, (uniforms.fractRenderValues ? 1 : 0));
      context.uniform1i(rpRenderFields.uniformLocations.u_renderMagnitude, (uniforms.renderMagnitude ? 1 : 0));
      context.uniform1i(rpRenderFields.uniformLocations.u_scaleRenderValues, (uniforms.scaleRenderValues ? 1 : 0));
      context.uniform1f(rpRenderFields.uniformLocations.u_maxFieldLines, uniforms.maxFieldLines);
      context.uniform1i(rpRenderFields.uniformLocations.u_renderTexture, uniforms.renderTexture);
      context.uniform1i(rpRenderFields.uniformLocations.u_audioColorShiftEnabled, uniforms.audioColorShiftEnabled);
      context.uniform3fv(rpRenderFields.uniformLocations.u_audioColorShift, uniforms.audioColorShift);
      context.uniform1i(rpRenderFields.uniformLocations.s_repelField, 0);
      context.uniform1i(rpRenderFields.uniformLocations.s_repelFieldGradient, 1);
    },
    encodeTextures: (context, uniforms, ops) => {
      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, ops.repelField);
      context.bindSampler(0, samplerNearest);

      context.activeTexture(context.TEXTURE1);
      context.bindTexture(context.TEXTURE_2D, ops.repelFieldGradient);
      context.bindSampler(1, samplerNearest);
    },
    encodeDraw: (context, uniforms, ops) => {
      context.bindVertexArray(anyQuad.vertexArray);
      context.drawArrays(context.TRIANGLES, 0, 6);
    }
  });

  rpRenderFields.setUniformLocations(gl, [
    'u_resolution',
    'u_rCoefficient',
    'u_renderTexture',
    'u_fractRenderValues',
    'u_maxFieldLines',
    'u_renderMagnitude',
    'u_scaleRenderValues',
    'u_audioColorShift',
    'u_audioColorShiftEnabled',
    's_repelField',
    's_repelFieldGradient'
  ]);

  var mipReducerMomentumSum = new MipReducerAttachment({
    id: 'MomentumSum',
    defaultValue: vec4.fromValues(0.0,0.0,0.0,0.0),
    internalFormat: gl.RGBA32F,
    init:
    "${texels}[0].z = distance(${texels}[0].xy, vec2(0.0,0.0));\n" +
    "${texels}[1].z = distance(${texels}[1].xy, vec2(0.0,0.0));\n" +
    "${texels}[2].z = distance(${texels}[2].xy, vec2(0.0,0.0));\n" +
    "${texels}[3].z = distance(${texels}[3].xy, vec2(0.0,0.0));\n",
    calc:
    "vec2 momentumSum = vec2(${texels}[0].xy + ${texels}[1].xy + ${texels}[2].xy + ${texels}[3].xy);\n" +
    "float momentumNormSum = ${texels}[0].z + ${texels}[1].z + ${texels}[2].z + ${texels}[3].z; \n",
    write: "vec4(momentumSum.xy, momentumNormSum, 0.0);"
  });

  var mipReducerMomentumMinMax = new MipReducerAttachment({
    id: 'MomentumMinMax',
    defaultValue: vec4.fromValues(Number.MAX_VALUE, Number.MIN_VALUE, 0.0, 0.0),
    internalFormat: gl.RGBA32F,
    init:
    "${texels}[0].xy = vec2(distance(${texels}[0].xy, vec2(0.0,0.0)), distance(${texels}[0].xy, vec2(0.0,0.0)));\n" +
    "${texels}[1].xy = vec2(distance(${texels}[1].xy, vec2(0.0,0.0)), distance(${texels}[1].xy, vec2(0.0,0.0)));\n" +
    "${texels}[2].xy = vec2(distance(${texels}[2].xy, vec2(0.0,0.0)), distance(${texels}[2].xy, vec2(0.0,0.0)));\n" +
    "${texels}[3].xy = vec2(distance(${texels}[3].xy, vec2(0.0,0.0)), distance(${texels}[3].xy, vec2(0.0,0.0)));\n",
    write: "vec4(min(min(min(${texels}[0].x,${texels}[1].x),${texels}[2].x),${texels}[3].x), \n" +
    "max(max(max(${texels}[0].y,${texels}[1].y),${texels}[2].y),${texels}[3].y), \n" +
    "0.0,0.0);"
  });

  var mipReducer = new MipReducer(particleResolution, [
    mipReducerMomentumSum,
    mipReducerMomentumMinMax //,
  ], {
    uniforms: {
      'u_particleCount': 'int'
    }
  });

  mipReducer.configure(gl, {});

// =======================================
// Render Pass: Aggregate Filters
// =======================================

// =======================================
// Web Audio
// =======================================

  class MicrophoneInput {
    constructor() {
      this._loaded = false;
      this._sampleRate = 512;
      this._isLive = false;
      this._waveformSum = 0;
      this._waveformSumMax = 4096 * 10;
      this._gain = 1.0; // technically logarithmic ¯\_(ツ)_/¯
    }

    initMic(audioContext, cb) {
      this._context = audioContext;
      navigator.mediaDevices.getUserMedia({audio: true})
        .then(cb)
        .catch(this.initMicError);
    }

    initMicGraph(stream) {
      var micInput = this._context.createMediaStreamSource(stream);
      // TODO: create context.createAnalyser() node if FFT is needed
      var scriptProcessor = this._context.createScriptProcessor(this._sampleRate, 1, 1);

      var thisMic = this;
      scriptProcessor.onaudioprocess = function(event) {
        var inputData = event.inputBuffer.getChannelData(0); // mono :(
        var waveformSum = 0;
        for (i=0; i < thisMic._sampleRate; i++) {
          waveformSum += thisMic._gain * Math.abs(inputData[i]);
        }
        thisMic.updateMicUniform(waveformSum);
      };

      micInput.connect(scriptProcessor);
      scriptProcessor.connect(this._context.destination);
      this._loaded = true;
    }

    initMicError(e) {
      console.error('Error initializing microphone', e);
    }

    updateMicUniform(waveformSum) {
      this._waveformSum += waveformSum % this._waveformSumMax;
    }

    getColorShift(rPeriod,gPeriod,bPeriod) {
      // r g b: the frequencies to modulate
      return vec3.fromValues(
        (this._waveformSum % rPeriod) / rPeriod,
        (this._waveformSum % gPeriod) / gPeriod,
        (this._waveformSum % bPeriod) / bPeriod);
    }

    enableControls() {
      var enabledCheckbox = document.getElementById('audio-color-shift-enabled');
      enabledCheckbox.checked = true;
      enabledCheckbox.enabled = true;
    }
  }

  var audioContext = new window.AudioContext();
  var mic = new MicrophoneInput();

  window.activateMic = function() {
    setTimeout(function() {
      mic.initMic(audioContext, function (stream) {
        mic.enableControls();
        mic.initMicGraph(stream);
        mic.isLive = true;
        document.getElementById('btn-activate-mic').className = "btn btn-danger navbar-btn";
      });
    }, 250);
  };

// =======================================
// Plot Scalar Values
// =======================================

  var numDataPoints = 50;

  function hexColorToVec4(hex) {
    return vec4.fromValues(
      parseInt(hex.substr(0,2), 16) / 255,
      parseInt(hex.substr(2,2), 16) / 255,
      parseInt(hex.substr(4,2), 16) / 255,
      1.0
    );
  }

  var bsPrimary = hexColorToVec4("337ab7"),
    bsSuccess = hexColorToVec4("5cb85c"),
    bsInfo = hexColorToVec4("5bc0de"),
    bsWarning = hexColorToVec4("f0ad4e"),
    bsDanger = hexColorToVec4("d9534f");

  var linePlots = {
    momentum: {
      plot: new LinePlot(gl, numDataPoints, {
        program: programLinePlot,
        transformProgram: programLinePlotTransform,
        lineColor: bsPrimary,
        lineWidth: 10,
        max: { value: 1, dynamic: true, expiresAfter: 500 },
        min: { value: 0, dynamic: true, expiresAfter: 500 }
      }),
      enabled: false,
      buttonClass: 'btn btn-info navbar-btn'
    },
    force: {
      plot: new LinePlot(gl, numDataPoints, {
        program: programLinePlot,
        transformProgram: programLinePlotTransform,
        lineColor: bsSuccess,
        lineWidth: 10,
        max: { value: 1, dynamic: true, expiresAfter: 500 },
        min: { value: 0, dynamic: true, expiresAfter: 500 }
      }),
      enabled: false,
      buttonClass: 'btn btn-success navbar-btn'
    },
    fps: {
      plot: new LinePlot(gl, numDataPoints, {
        program: programLinePlot,
        transformProgram: programLinePlotTransform,
        lineColor: bsDanger,
        lineWidth: 10,
        max: { value: 1, dynamic: true, expiresAfter: 500 },
        min: { value: 0, dynamic: false, expiresAfter: 500 }
      }),
      enabled: false,
      buttonClass: 'btn btn-danger navbar-btn'
    }
  };

// =======================================
// UI Controls
// =======================================

  var particleCount, particleSpeed;
  var fieldSize, fieldMinFactor, rCoefficient, maxFieldLines;
  var renderTexture, physicsMethod;
  var paused = false;

  var physicsMethods = {
    brownian: 0,
    splat: 1,
    field: 2
  };

  var spaceType = 0;
  var spaceTypes = {
    finite: 0,
    wrapped: 1,
    infinite: 2
  };

  var fractRenderValues, renderMagnitude, forceCalcInGlPointSpace;

  var scaleRenderValues, circularFieldEffect, deferGradientCalc;
  var resetParticles = false, resetParticlesWith = 'random';

  window.setResetParticles = function() {
    resetParticles = true;
  };

  window.setResetParticlesWith = function(k) {
    resetParticlesWith = k;
  };

  var particleResetVectorFields = {
    random: function(x,y) {
      return new Float32Array([2 * Math.random() - 1.0, 2 * Math.random() - 1.0, 0, 0]);
    },
    zero: function(x,y) {
      return new Float32Array([0,0,0,0]);
    },
    outward: function(x,y) {
      return new Float32Array([x, y, 0, 0]);
    },
    inward: function(x,y) {
      return new Float32Array([-x, -y, 0, 0]);
    },
    'right-vortex': function(x,y) {
      return new Float32Array([y, -x, 0, 0]);
    },
    'left-vortex': function(x,y) {
      return new Float32Array([-y, x, 0, 0]);
    },
    'merger': function(x,y) {
      return new Float32Array([-y, -x, 0, 0]);
    },
    'vector-field-xy-x': function(x,y) {
      return new Float32Array([x * y, -x, 0, 0]);
    },
    'vector-field-y-xy': function(x,y) {
      return new Float32Array([y * x, y, 0, 0]);
    }
  };

  var audioColorShift = vec3.fromValues(0.0, 0.0, 0.0),
    audioColorShiftGain = 1.0,
    audioColorShiftEnabled = false;

  function getUIElemements() {
    var ui = {
      particleCount: document.getElementById('particle-count'),
      particleSpeed: document.getElementById('particle-speed'),
      rCoefficient: document.getElementById('r-coefficient'),
      fieldSize: document.getElementById('field-size'),
      fieldMinFactor: document.getElementById('field-min-factor'),
      maxFieldLines: document.getElementById('max-field-lines'),

      scaleForceToSpace: document.getElementById('scale-force-to-space'),
      circularFieldEffect: document.getElementById('circular-field-effect'),
      deferGradientCalc: document.getElementById('defer-gradient-calc'),

      fractRenderValues: document.getElementById('fract-render-values'),
      scaleRenderValues: document.getElementById('scale-render-values'),
      renderMagnitude: document.getElementById('render-magnitude'),

      audioColorShift: {
        gain: document.getElementById('audio-color-shift-gain'),
        enabled: document.getElementById('audio-color-shift-enabled'),
        r: document.getElementById('audio-color-shift-r'),
        g: document.getElementById('audio-color-shift-g'),
        b: document.getElementById('audio-color-shift-b')
      },
      spaceType: document.getElementsByName('space-type'),
      renderTexture: document.getElementsByName('render-texture'),
      physicsMethod: document.getElementsByName('physics-method'),
      togglePlot: {
        momentum: document.getElementById('toggle-plot-momentum'),
        force: document.getElementById('toggle-plot-force'),
        fps: document.getElementById('toggle-plot-fps')
      }
    };

    return ui;
  }

  function uiControlUpdate(ui = {}) {
    particleCount = ui.particleCount.value;
    particleSpeed = ui.particleSpeed.value;
    rCoefficient = ui.rCoefficient.value;
    fieldSize = ui.fieldSize.value;
    fieldMinFactor = ui.fieldMinFactor.value;
    maxFieldLines = ui.maxFieldLines.value;

    deferGradientCalc = ui.deferGradientCalc.checked;
    fractRenderValues = ui.fractRenderValues.checked;
    scaleRenderValues = ui.scaleRenderValues.checked;
    renderMagnitude = ui.renderMagnitude.checked;
    circularFieldEffect = ui.circularFieldEffect.checked;

    forceCalcInGlPointSpace = !ui.scaleForceToSpace.checked;
    if (forceCalcInGlPointSpace) {
      rCoefficient /= 10;
    }

    audioColorShiftEnabled = ui.audioColorShift.enabled.checked;
    audioColorShiftGain = ui.audioColorShift.gain.value;
    audioColorShift = mic.getColorShift(
      ui.audioColorShift.r.value,
      ui.audioColorShift.g.value,
      ui.audioColorShift.b.value);

    var renderTextureRadios = ui.renderTexture;
    renderTexture = [0,1,2].reduce((a,i) => renderTextureRadios[i].checked ? i : a, 0);

    var physicsMethodRadios = ui.physicsMethod;
    physicsMethod = [0,1,2].reduce((a,i) => physicsMethodRadios[i].checked ? i : a, 0);

    var spaceTypeRadios = ui.spaceType;
    spaceType = [0,1,2].reduce((a,i) => spaceTypeRadios[i].checked ? i : a, 0);

    for (var k of ['momentum', 'fps']) {
      linePlots[k].enabled = ui.togglePlot[k].checked;
    }
  }

  window.togglePause = function() {
    paused = !paused;
    var pauseButton = document.getElementById('btn-play-pause');

    if (paused) {
      pauseButton.innerHTML = '<i class="fa fa-lg fa-play">'
    } else {
      pauseButton.innerHTML = '<i class="fa fa-lg fa-pause">'
    }
  };

  // Yes, it's the worst two-way databinding ever
  var configProfiles = {
    defaults: function(ui = {}) {
      ui.particleCount.value = 512;
      ui.particleSpeed.value = 0.05;
      ui.rCoefficient.value = 0.1;
      ui.fieldSize.value = 75.0;
      ui.fieldMinFactor = 3.0;
      ui.maxFieldLines.value = 1.0;

      ui.scaleForceToSpace.checked = false;
      ui.circularFieldEffect.checked = true;
      ui.deferGradientCalc.checked = false;

      [ui.fractRenderValues, ui.scaleRenderValues, ui.renderMagnitude].forEach((el, i) => {
        el.checked = false;
        el.parentElement.classList.remove('active');
      });

      ui.spaceType.forEach((el, i) => {
        el.checked = (i == 1);
        if (el.checked) {
          el.parentElement.classList.add('active');
        } else {
          el.parentElement.classList.remove('active');
        }
      });

      ui.renderTexture.forEach((el, i) => {
        el.checked = (i == 0);
        if (el.checked) {
          el.parentElement.classList.add('active');
        } else {
          el.parentElement.classList.remove('active');
        }
      });

      ui.physicsMethod.forEach((el, i) => {
        el.checked = (i == 0);
        if (el.checked) {
          el.parentElement.classList.add('active');
        } else {
          el.parentElement.classList.remove('active');
        }
      });
    },

    random: function(ui = {}) {
      var randomFactor = function(range) {
        return 1 + (range * Math.random() - range / 2.0);
      };

      var randomBoolean = function(chance = 0.5) {
        return (Math.random() > chance);
      };

      var randomDataToggle = function(elemSet, pSet) {
        var rand = Math.random();
        for (var i = 0; i < elemSet.length; i++) {
          elemSet[i].checked = (rand >= pSet[i] && rand < pSet[i+1]);
          if (elemSet[i].checked) {
            elemSet[i].parentElement.classList.add('active');
          } else {
            elemSet[i].parentElement.classList.remove('active');
          }
        }
      };

      ui.deferGradientCalc = false;
      ui.rCoefficient.value = ui.rCoefficient.value * randomFactor(0.125);
      ui.fieldSize.value = ui.fieldSize.value * randomFactor(0.125);
      ui.fieldMinFactor.value = ui.fieldMinFactor * randomFactor(0.25);

      ui.scaleRenderValues.checked = randomBoolean(0.1);
      ui.circularFieldEffect.checked = randomBoolean(0.1);
      ui.fractRenderValues.checked = randomBoolean(0.25);
      ui.renderMagnitude.checked = randomBoolean(0.1);

      [ui.fractRenderValues, ui.scaleRenderValues, ui.renderMagnitude].forEach((el, i) => {
        if (el.checked) {
          el.parentElement.classList.add('active');
        } else {
          el.parentElement.classList.remove('active');
        }
      });

      if (ui.renderMagnitude.checked) {
        ui.renderMagnitude.parentElement.classList.add('active');
      } else {
        ui.renderMagnitude.parentElement.classList.remove('active');
      }

      if (ui.fractRenderValues.checked) {
        ui.maxFieldLines.value = Math.trunc((2/3)*ui.maxFieldLines.max * Math.random());
      }

      randomDataToggle(ui.renderTexture, [0.0, 0.15, 0.5, 1.0]);
      randomDataToggle(ui.physicsMethod, [0.0, 0.45, 0.5, 1.0]);
    }
  };

  window.activateProfile = function(k) {
    var uiElements = getUIElemements();
    configProfiles[k](uiElements);
  };

  var anyQuad = new Quad(gl);

  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  gl.viewport(0, 0, renderResolution[0], renderResolution[1]);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var framecount = 0;

  var startTime = Date.now(),
    currentTime = startTime,
    elapsedTime = currentTime - startTime,
    simulationTime = elapsedTime,
    lastAggregateTime = simulationTime,
    lastFrameStart = currentTime,
    lastFrameTime = currentTime - lastFrameStart;

  var deltaT = vec4.fromValues(0.0,0.0,0.0,0.0);

// =======================================
// Debug Code
// =======================================

  var debugPixels = new Float32Array(renderResolution[0] * renderResolution[1] * 4);

  function renderDebugTexture(pixels) {

    gl.activeTexture(gl.TEXTURE0);
    var debugTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, debugTexture);

    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, renderResolution[0], renderResolution[1]);
    gl.texSubImage2D(gl.TEXTURE_2D,
      0,
      0, // x offset
      0, // y offset
      renderResolution[0],
      renderResolution[1],
      gl.RGBA,
      gl.FLOAT,
      pixels);
    gl.bindTexture(gl.TEXTURE_2D, null);

    createDebugTexture = false;
  }

// =======================================
// Render Loop
// =======================================

  function render() {
    framecount++;
    updateTime();

    deltaT = updateDeltaT(deltaT, lastFrameTime);
    var uiElements = getUIElemements();
    uiControlUpdate(uiElements);

    if (resetParticles) {
      var newPositions = generateFloat32Randoms(particleResolution[0], particleResolution[1], 4, -0.5, 0.5);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, particlePonger.getCurrent('particles'));
      gl.texSubImage2D(gl.TEXTURE_2D,
        0,
        0, // x offset
        0, // y offset
        particleResolution[0],
        particleResolution[1],
        gl.RGBA,
        gl.FLOAT,
        newPositions);

      var newParticleMomentums = new Float32Array(particleResolution[0] * particleResolution [1] * 4);
      for (var i = 0; i < newParticleMomentums.length; i += 4) {
        newParticleMomentums.set(particleResetVectorFields[resetParticlesWith](newPositions[i], newPositions[i+1]), i);
      }

      gl.bindTexture(gl.TEXTURE_2D, particlePonger.getCurrent('particleMomentums'));
      gl.texSubImage2D(gl.TEXTURE_2D,
        0,
        0, // x offset
        0, // y offset
        particleResolution[0],
        particleResolution[1],
        gl.RGBA,
        gl.FLOAT,
        newParticleMomentums);
      gl.bindTexture(gl.TEXTURE_2D, null);

      resetParticles = false;
    }

    if (!paused) {

      if (physicsMethod == physicsMethods.splat) {
        var forceSplatUniforms = {
          resolution: particleResolution,
          rCoefficient: rCoefficient,
          particleIdLimit: particleCount
        };

        rpForceSplat.encode(gl, forceSplatUniforms, {
          framebuffer: forceSplatFbo,
          particles: particlePonger.getCurrent('particles'),
          particleCount: particleCount
        });
      }

      var particleUniforms = {
        resolution: particleResolution,
        fieldResolution: renderResolution,
        randomSeed: makeIntRandomUniforms(),
        particleSpeed: particleSpeed,
        deltaTime: deltaT,
        physicsMethod: physicsMethod,
        spaceType: spaceType
      };

      rpParticles.encode(gl, particleUniforms, {
        framebuffer: particlePonger.getCurrentFbo(),
        particleRandoms: particlePonger.getCurrent('particleRandoms'),
        particles: particlePonger.getCurrent('particles'),
        particleMomentums: particlePonger.getCurrent('particleMomentums'),
        particleForceSplat: forceSplatTexture,
        repelField: fieldPonger.getCurrent('repelField')
      });

      particlePonger.increment();

    }

    var fieldsUniforms = {
      resolution: renderResolution,
      fieldSize: fieldSize,
      rCoefficient: rCoefficient,
      deferGradientCalc: deferGradientCalc,
      circularFieldEffect: circularFieldEffect,
      forceCalcInGlPointSpace: forceCalcInGlPointSpace,
      fieldMinFactor: fieldMinFactor
    };

    rpFields.encode(gl, fieldsUniforms, {
      framebuffer: fieldPonger.getCurrentFbo(),
      particles: particlePonger.getCurrent('particles'),
      particleCount: particleCount
    });

    fieldPonger.increment();

    var gradientTexture;
    if (deferGradientCalc) {
      var gradientsUniforms = {
        resolution: renderResolution
      };

      rpGradients.encode(gl, gradientsUniforms, {
        framebuffer: gradientPonger.getCurrentFbo(),
        repelField: fieldPonger.getCurrent('repelField')
      });

      gradientTexture = gradientPonger.getNext('repelFieldGradient');
    } else {
      gradientTexture = fieldPonger.getCurrent('repelFieldGradient');
    }
    gradientPonger.increment();

    var renderFieldsUniforms = {
      resolution: renderResolution,
      rCoefficient: rCoefficient,
      fractRenderValues: fractRenderValues,
      scaleRenderValues: scaleRenderValues,
      renderMagnitude: renderMagnitude,
      maxFieldLines: maxFieldLines,
      renderTexture: renderTexture,
      audioColorShiftEnabled: audioColorShiftEnabled,
      audioColorShift: audioColorShift
    };

    var renderFieldsOptions = {
      framebuffer: null,
      repelField: fieldPonger.getCurrent('repelField'),
      repelFieldGradient: gradientTexture
    };

    rpRenderFields.encode(gl, renderFieldsUniforms, renderFieldsOptions);

    // update aggregate values & line plots
    if (!paused) {
      if (simulationTime - lastAggregateTime > 100) {

        var reducedAggregates = mipReducer.reduce(gl, {}, {
          MomentumSum: particlePonger.getCurrent('particles'),
          MomentumMinMax: particlePonger.getCurrent('particles'),
          quad: anyQuad
        });

        var instantaneousFps = 1000 / deltaT[0];
        var averageMomentum = reducedAggregates['MomentumSum'][2];

        document.getElementById('stats-fps-label').innerText = `${Math.trunc(instantaneousFps)} FPS`;

        linePlots['momentum'].plot.push([simulationTime, averageMomentum]);
        //linePlots['force'].plot.push([simulationTime, Math.random()/2]);
        linePlots['fps'].plot.push([simulationTime, instantaneousFps]);
      }
    }

    for (var k of Object.keys(linePlots)) {
      if (linePlots[k].enabled) {
        linePlots[k].plot.encodeTransform(gl, {
          resolution: renderResolution
        });
        linePlots[k].plot.encode(gl, {
          resolution: renderResolution,
          beforeEncode: (context, plot) => {
            context.bindFramebuffer(context.DRAW_FRAMEBUFFER, null);
            context.blendFunc(context.ONE, context.ZERO);
          }
        })
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

var createDebugTexture = false;

function fixCanvasUIBar() {
  // this might be a bug in the browser, but it's happening in both Firefox & Chrome

  var uiBar = document.getElementById('canvas-ui-bar-bottom');
  var canvasHeight = window.getComputedStyle(document.getElementById('main-canvas')).height;
  var containerHeight = window.getComputedStyle(document.getElementById('main-canvas-container')).height;

  canvasHeight = parseFloat(canvasHeight.substr(0, canvasHeight.length - 2));
  containerHeight = parseFloat(containerHeight.substr(0, containerHeight.length - 2));

  var shadowPaddingHeight = canvasHeight - containerHeight;
  if (shadowPaddingHeight < 0) {
    uiBar.style.marginTop = `${shadowPaddingHeight}px`
  }
}

window.onload = function() {
  fixCanvasUIBar();
  runWebGL();
};
