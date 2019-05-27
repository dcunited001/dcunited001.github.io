/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_MipReducer_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_Quad_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_LinePlot_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_util__ = __webpack_require__(4);






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
    lastFrameTime = currentTime - lastFrameStart;

    // TODO: check simluationTime
    simulationTime += paused ? 0 : lastFrameTime;
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
    var mid = min + range / 2;
    for (var i = 0; i < w * h * n; i++) {
      randoms[i] = Math.random() * range + min;
    }
    return randoms;
  }

  function generateInt32Randoms(w, h, n) {
    var randoms = new Int32Array(w * h * n);
    for (var i = 0; i < w * h * n; i++) {
      randoms[i] = Math.trunc(Math.random() * UINT32_MAX - INT32_MAX);
    }
    return randoms;
  }

  function generateParticleIndices(h, w) {
    var indices = new Int32Array(h * w);
    for (var i = 0; i < h * w; i++) {
      indices[i] = i;
    }
    return indices;
  }

  function makeIntRandomUniforms() {
    return new Int32Array([Math.trunc(Math.random() * UINT32_MAX - INT32_MAX), Math.trunc(Math.random() * UINT32_MAX - INT32_MAX), Math.trunc(Math.random() * UINT32_MAX - INT32_MAX), Math.trunc(Math.random() * UINT32_MAX - INT32_MAX)]);
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

    get program() {
      return this._program;
    }
    set program(program) {
      this._program = program;
    }
    get options() {
      return this._options;
    }
    set options(options) {
      this._options = options;
    }

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
      console.error("RenderPass: override encodeUniforms() or pass 'encodeUniforms'");
    }

    encodeDraw(c, uniforms, options = {}) {
      console.error("RenderPass: override encodeDraw() or pass 'encodeDraw'");
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
    constructor(options = {}) {
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

    getNext(k, ...args) {
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

  var gl = canvas.getContext('webgl2', { antialias: true });
  var colorBufferFloatExt = gl.getExtension('EXT_color_buffer_float');
  if (!colorBufferFloatExt) {
    console.error("EXT_color_buffer_float not supported.");
  }

  var isWebGL2 = !!gl;
  if (!isWebGL2) {
    document.getElementById('info').innerHTML = 'WebGL 2 is not available.  See <a href="https://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">How to get a WebGL 2 implementation</a>';
    console.error('WebGL 2 is not available.');
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);

  var UINT32_MAX = 2 ** 32 - 1;
  var INT32_MAX = 2 ** 31 - 1;

  // =======================================
  // GLSL Programs
  // =======================================

  var programParticles = createProgram(gl, document.getElementById('vsPass').textContent, document.getElementById('fsUpdateParticles').textContent);

  var programForceSplat = createProgram(gl, document.getElementById('vsPass').textContent, document.getElementById('fsForceSplat').textContent);

  var programFields = createProgram(gl, document.getElementById('vsFields').textContent, document.getElementById('fsFields').textContent);

  var programGradients = createProgram(gl, document.getElementById('vsPass').textContent, document.getElementById('fsGradients').textContent);

  var programRenderFields = createProgram(gl, document.getElementById('vsPass').textContent, document.getElementById('fsRenderFields').textContent);

  var programLinePlotTransform = createProgram(gl, document.getElementById('vsLinePlotTransform').textContent, document.getElementById('fsNull').textContent, {
    beforeLink: (context, program) => {
      var varyings = ['v_positionA', 'v_positionB'];
      context.transformFeedbackVaryings(program, varyings, context.INTERLEAVED_ATTRIBS);
    }
  });

  var programLinePlot = createProgram(gl, document.getElementById('vsLinePlot').textContent, document.getElementById('fsLinePlot').textContent);

  // =======================================
  // Particles
  // =======================================

  var PARTICLE_MAX = parseInt(document.getElementById('particle-count').max);
  var PARTICLE_WIDTH = 32;
  var particleResolution = vec2.fromValues(PARTICLE_WIDTH, PARTICLE_MAX / PARTICLE_WIDTH);
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

  var particlePonger = new PingPongProvider({ max: 3 });

  var particleRandomsAttachments, particleAttachments, particleMomentums, particleForces;

  particleRandomsAttachments = [0, 1, 2].map(f => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32I, particleResolution[0], particleResolution[1]);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, // x offset
    0, // y offset
    particleResolution[0], particleResolution[1], gl.RGBA_INTEGER, gl.INT, generateInt32Randoms(particleResolution[0], particleResolution[1], 4));

    // TODO: load random seeds from image
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  });

  particleAttachments = [0, 1, 2].map(f => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, particleResolution[0], particleResolution[1]);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, // x offset
    0, // y offset
    particleResolution[0], particleResolution[1], gl.RGBA, gl.FLOAT, generateFloat32Randoms(particleResolution[0], particleResolution[1], 4, -0.5, 0.5));

    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  });

  particleMomentums = [0, 1, 2].map(f => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, particleResolution[0], particleResolution[1]);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, // x offset
    0, // y offset
    particleResolution[0], particleResolution[1], gl.RGBA, gl.FLOAT, generateFloat32Randoms(particleResolution[0], particleResolution[1], 4, -0.05, 0.05));

    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  });

  particleForces = [0, 1, 2].map(f => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, particleResolution[0], particleResolution[1]);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, // x offset
    0, // y offset
    particleResolution[0], particleResolution[1], gl.RGBA, gl.FLOAT, new Float32Array(particleResolution[0] * particleResolution[1] * 4));

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
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
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

  var fieldPonger = new PingPongProvider({ max: 3 });
  var fieldRForceAttachments, fieldRForceGradientAttachments;

  fieldRForceAttachments = [0, 1, 2].map(i => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, renderResolution[0], renderResolution[1]);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  });

  fieldRForceGradientAttachments = [0, 1, 2].map(i => {
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

  var gradientPonger = new PingPongProvider({ max: 3 });
  var gradientRForceAttachments;

  gradientRForceAttachments = [0, 1, 2].map(i => {
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
      context.drawBuffers([context.COLOR_ATTACHMENT0, context.COLOR_ATTACHMENT1, context.COLOR_ATTACHMENT2, context.COLOR_ATTACHMENT3]);

      context.bindVertexArray(anyQuad.vertexArray);
      context.drawArrays(context.TRIANGLES, 0, 6);
    }
  });

  rpParticles.setUniformLocations(gl, ['u_resolution', 'u_fieldResolution', 'u_randomSeed', 'u_particleSpeed', 'u_deltaTime', 'u_physicsMethod', 'u_spaceType', 's_particleRandoms', 's_particles', 's_particleMomentums', 's_particleForceSplat', 's_repelField']);

  // =======================================
  // Render Pass: Force Splatting
  // =======================================

  var rpForceSplat = new RenderPass(programForceSplat, {
    beforeEncode: (context, uniforms, ops) => {
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, ops.framebuffer);
      context.blendFunc(context.ONE, context.ONE);
      context.viewport(0, 0, uniforms.resolution[0], uniforms.resolution[1]);
      context.clearColor(0.0, 0.0, 0.0, 0.0);
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
      context.drawBuffers([context.COLOR_ATTACHMENT0]);

      for (var i = 0; i < ops.particleCount; i++) {
        var particleUv = [i % particleResolution[0], Math.trunc(i / particleResolution[1])];
        context.uniform2iv(rpForceSplat.uniformLocations.u_particleUv, particleUv);
        context.bindVertexArray(anyQuad.vertexArray);
        context.drawArrays(context.TRIANGLES, 0, 6);
      }
    }
  });

  rpForceSplat.setUniformLocations(gl, ['u_resolution', 'u_particleUv', 'u_rCoefficient', 'u_particleIdLimit', 's_particles']);

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
      context.uniform1i(rpFields.uniformLocations.u_deferGradientCalc, uniforms.deferGradientCalc ? 1 : 0);
      context.uniform1i(rpFields.uniformLocations.u_circularFieldEffect, uniforms.circularFieldEffect ? 1 : 0);
      context.uniform1i(rpFields.uniformLocations.u_forceCalcInGlPointSpace, uniforms.forceCalcInGlPointSpace ? 1 : 0);
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
      context.drawBuffers([context.COLOR_ATTACHMENT0, context.COLOR_ATTACHMENT1]);

      context.bindVertexArray(particleVertexArray);
      context.drawArrays(context.POINTS, 0, ops.particleCount);
    }
  });

  rpFields.setUniformLocations(gl, ['u_resolution', 'u_fieldSize', 'u_rCoefficient', 'u_fieldMinFactor', 's_particles', 'u_deferGradientCalc', 'u_circularFieldEffect', 'u_forceCalcInGlPointSpace']);

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
      context.drawBuffers([context.COLOR_ATTACHMENT0]);

      context.bindVertexArray(anyQuad.vertexArray);
      context.drawArrays(context.TRIANGLES, 0, 6);
    }
  });

  rpGradients.setUniformLocations(gl, ['u_resolution', 's_repelField']);

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
      context.uniform1i(rpRenderFields.uniformLocations.u_fractRenderValues, uniforms.fractRenderValues ? 1 : 0);
      context.uniform1i(rpRenderFields.uniformLocations.u_renderMagnitude, uniforms.renderMagnitude ? 1 : 0);
      context.uniform1i(rpRenderFields.uniformLocations.u_scaleRenderValues, uniforms.scaleRenderValues ? 1 : 0);
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

  rpRenderFields.setUniformLocations(gl, ['u_resolution', 'u_rCoefficient', 'u_renderTexture', 'u_fractRenderValues', 'u_maxFieldLines', 'u_renderMagnitude', 'u_scaleRenderValues', 'u_audioColorShift', 'u_audioColorShiftEnabled', 's_repelField', 's_repelFieldGradient']);

  var mipReducerMomentumSum = new __WEBPACK_IMPORTED_MODULE_0__lib_MipReducer_js__["b" /* MipReducerAttachment */]({
    id: 'MomentumSum',
    defaultValue: vec4.fromValues(0.0, 0.0, 0.0, 0.0),
    internalFormat: gl.RGBA32F,
    init: "${texels}[0].z = distance(${texels}[0].xy, vec2(0.0,0.0));\n" + "${texels}[1].z = distance(${texels}[1].xy, vec2(0.0,0.0));\n" + "${texels}[2].z = distance(${texels}[2].xy, vec2(0.0,0.0));\n" + "${texels}[3].z = distance(${texels}[3].xy, vec2(0.0,0.0));\n",
    calc: "vec2 momentumSum = vec2(${texels}[0].xy + ${texels}[1].xy + ${texels}[2].xy + ${texels}[3].xy);\n" + "float momentumNormSum = ${texels}[0].z + ${texels}[1].z + ${texels}[2].z + ${texels}[3].z; \n",
    write: "vec4(momentumSum.xy, momentumNormSum, 0.0);"
  });

  var mipReducerMomentumMinMax = new __WEBPACK_IMPORTED_MODULE_0__lib_MipReducer_js__["b" /* MipReducerAttachment */]({
    id: 'MomentumMinMax',
    defaultValue: vec4.fromValues(Number.MAX_VALUE, Number.MIN_VALUE, 0.0, 0.0),
    internalFormat: gl.RGBA32F,
    init: "${texels}[0].xy = vec2(distance(${texels}[0].xy, vec2(0.0,0.0)), distance(${texels}[0].xy, vec2(0.0,0.0)));\n" + "${texels}[1].xy = vec2(distance(${texels}[1].xy, vec2(0.0,0.0)), distance(${texels}[1].xy, vec2(0.0,0.0)));\n" + "${texels}[2].xy = vec2(distance(${texels}[2].xy, vec2(0.0,0.0)), distance(${texels}[2].xy, vec2(0.0,0.0)));\n" + "${texels}[3].xy = vec2(distance(${texels}[3].xy, vec2(0.0,0.0)), distance(${texels}[3].xy, vec2(0.0,0.0)));\n",
    write: "vec4(min(min(min(${texels}[0].x,${texels}[1].x),${texels}[2].x),${texels}[3].x), \n" + "max(max(max(${texels}[0].y,${texels}[1].y),${texels}[2].y),${texels}[3].y), \n" + "0.0,0.0);"
  });

  var mipReducer = new __WEBPACK_IMPORTED_MODULE_0__lib_MipReducer_js__["a" /* MipReducer */](particleResolution, [mipReducerMomentumSum, mipReducerMomentumMinMax //,
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
      navigator.mediaDevices.getUserMedia({ audio: true }).then(cb).catch(this.initMicError);
    }

    initMicGraph(stream) {
      var micInput = this._context.createMediaStreamSource(stream);
      // TODO: create context.createAnalyser() node if FFT is needed
      var scriptProcessor = this._context.createScriptProcessor(this._sampleRate, 1, 1);

      var thisMic = this;
      scriptProcessor.onaudioprocess = function (event) {
        var inputData = event.inputBuffer.getChannelData(0); // mono :(
        var waveformSum = 0;
        for (i = 0; i < thisMic._sampleRate; i++) {
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

    getColorShift(rPeriod, gPeriod, bPeriod) {
      // r g b: the frequencies to modulate
      return vec3.fromValues(this._waveformSum % rPeriod / rPeriod, this._waveformSum % gPeriod / gPeriod, this._waveformSum % bPeriod / bPeriod);
    }

    enableControls() {
      var enabledCheckbox = document.getElementById('audio-color-shift-enabled');
      enabledCheckbox.checked = true;
      enabledCheckbox.enabled = true;
    }
  }

  var audioContext = new window.AudioContext();
  var mic = new MicrophoneInput();

  window.activateMic = function () {
    setTimeout(function () {
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
    return vec4.fromValues(parseInt(hex.substr(0, 2), 16) / 255, parseInt(hex.substr(2, 2), 16) / 255, parseInt(hex.substr(4, 2), 16) / 255, 1.0);
  }

  var bsPrimary = hexColorToVec4("337ab7"),
      bsSuccess = hexColorToVec4("5cb85c"),
      bsInfo = hexColorToVec4("5bc0de"),
      bsWarning = hexColorToVec4("f0ad4e"),
      bsDanger = hexColorToVec4("d9534f");

  var linePlots = {
    momentum: {
      plot: new __WEBPACK_IMPORTED_MODULE_2__lib_LinePlot_js__["a" /* LinePlot */](gl, numDataPoints, {
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
      plot: new __WEBPACK_IMPORTED_MODULE_2__lib_LinePlot_js__["a" /* LinePlot */](gl, numDataPoints, {
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
      plot: new __WEBPACK_IMPORTED_MODULE_2__lib_LinePlot_js__["a" /* LinePlot */](gl, numDataPoints, {
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
  var resetParticles = false,
      resetParticlesWith = 'random';

  window.setResetParticles = function () {
    resetParticles = true;
  };

  window.setResetParticlesWith = function (k) {
    resetParticlesWith = k;
  };

  var particleResetVectorFields = {
    random: function (x, y) {
      return new Float32Array([2 * Math.random() - 1.0, 2 * Math.random() - 1.0, 0, 0]);
    },
    zero: function (x, y) {
      return new Float32Array([0, 0, 0, 0]);
    },
    outward: function (x, y) {
      return new Float32Array([x, y, 0, 0]);
    },
    inward: function (x, y) {
      return new Float32Array([-x, -y, 0, 0]);
    },
    'right-vortex': function (x, y) {
      return new Float32Array([y, -x, 0, 0]);
    },
    'left-vortex': function (x, y) {
      return new Float32Array([-y, x, 0, 0]);
    },
    'merger': function (x, y) {
      return new Float32Array([-y, -x, 0, 0]);
    },
    'vector-field-xy-x': function (x, y) {
      return new Float32Array([x * y, -x, 0, 0]);
    },
    'vector-field-y-xy': function (x, y) {
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
    audioColorShift = mic.getColorShift(ui.audioColorShift.r.value, ui.audioColorShift.g.value, ui.audioColorShift.b.value);

    var renderTextureRadios = ui.renderTexture;
    renderTexture = [0, 1, 2].reduce((a, i) => renderTextureRadios[i].checked ? i : a, 0);

    var physicsMethodRadios = ui.physicsMethod;
    physicsMethod = [0, 1, 2].reduce((a, i) => physicsMethodRadios[i].checked ? i : a, 0);

    var spaceTypeRadios = ui.spaceType;
    spaceType = [0, 1, 2].reduce((a, i) => spaceTypeRadios[i].checked ? i : a, 0);

    for (var k of ['momentum', 'fps']) {
      linePlots[k].enabled = ui.togglePlot[k].checked;
    }
  }

  window.togglePause = function () {
    paused = !paused;
    var pauseButton = document.getElementById('btn-play-pause');

    if (paused) {
      pauseButton.innerHTML = '<i class="fa fa-lg fa-play">';
    } else {
      pauseButton.innerHTML = '<i class="fa fa-lg fa-pause">';
    }
  };

  // Yes, it's the worst two-way databinding ever
  var configProfiles = {
    defaults: function (ui = {}) {
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
        el.checked = i == 1;
        if (el.checked) {
          el.parentElement.classList.add('active');
        } else {
          el.parentElement.classList.remove('active');
        }
      });

      ui.renderTexture.forEach((el, i) => {
        el.checked = i == 0;
        if (el.checked) {
          el.parentElement.classList.add('active');
        } else {
          el.parentElement.classList.remove('active');
        }
      });

      ui.physicsMethod.forEach((el, i) => {
        el.checked = i == 0;
        if (el.checked) {
          el.parentElement.classList.add('active');
        } else {
          el.parentElement.classList.remove('active');
        }
      });
    },

    random: function (ui = {}) {
      var randomFactor = function (range) {
        return 1 + (range * Math.random() - range / 2.0);
      };

      var randomBoolean = function (chance = 0.5) {
        return Math.random() > chance;
      };

      var randomDataToggle = function (elemSet, pSet) {
        var rand = Math.random();
        for (var i = 0; i < elemSet.length; i++) {
          elemSet[i].checked = rand >= pSet[i] && rand < pSet[i + 1];
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
        ui.maxFieldLines.value = Math.trunc(2 / 3 * ui.maxFieldLines.max * Math.random());
      }

      randomDataToggle(ui.renderTexture, [0.0, 0.15, 0.5, 1.0]);
      randomDataToggle(ui.physicsMethod, [0.0, 0.45, 0.5, 1.0]);
    }
  };

  window.activateProfile = function (k) {
    var uiElements = getUIElemements();
    configProfiles[k](uiElements);
  };

  var anyQuad = new __WEBPACK_IMPORTED_MODULE_1__lib_Quad_js__["a" /* Quad */](gl);

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

  var deltaT = vec4.fromValues(0.0, 0.0, 0.0, 0.0);

  // =======================================
  // Debug Code
  // =======================================

  var debugPixels = new Float32Array(renderResolution[0] * renderResolution[1] * 4);

  function renderDebugTexture(pixels) {

    gl.activeTexture(gl.TEXTURE0);
    var debugTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, debugTexture);

    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, renderResolution[0], renderResolution[1]);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, // x offset
    0, // y offset
    renderResolution[0], renderResolution[1], gl.RGBA, gl.FLOAT, pixels);
    gl.bindTexture(gl.TEXTURE_2D, null);
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
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, // x offset
      0, // y offset
      particleResolution[0], particleResolution[1], gl.RGBA, gl.FLOAT, newPositions);

      var newParticleMomentums = new Float32Array(particleResolution[0] * particleResolution[1] * 4);
      for (var i = 0; i < newParticleMomentums.length; i += 4) {
        newParticleMomentums.set(particleResetVectorFields[resetParticlesWith](newPositions[i], newPositions[i + 1]), i);
      }

      gl.bindTexture(gl.TEXTURE_2D, particlePonger.getCurrent('particleMomentums'));
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, // x offset
      0, // y offset
      particleResolution[0], particleResolution[1], gl.RGBA, gl.FLOAT, newParticleMomentums);
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
        });
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

window.onload = function () {
  __WEBPACK_IMPORTED_MODULE_3__lib_util__["a" /* Platform */].fixCanvasUIBar(...['main-canvas-container', 'main-canvas', 'canvas-ui-bar-bottom'].map(id => document.getElementById(id)));
  runWebGL();
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MipReducer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MipReducerAttachment; });
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
    var readOffset, readSize;
    if (iteration == -1) {
      readOffset = [0,0];
      readSize = [this._resolution[0], this._resolution[1]];
    } else {
      readOffset = [this._mipmaps[iteration].pos[0], this._mipmaps[iteration].pos[1]];
      readSize = [this._mipmaps[iteration].res[0], this._mipmaps[iteration].res[1]];
    }
    // chrome doesn't allow uniform2iv to be submitted with Float32Array =/
    context.uniform2iv(this._uniformLocations.u_readOffset, readOffset);
    context.uniform2iv(this._uniformLocations.u_readSize, readSize);

    var writeOffset = [this._mipmaps[iteration+1].pos[0],  this._mipmaps[iteration+1].pos[1]];
    var writeSize = [this._mipmaps[iteration+1].res[0],  this._mipmaps[iteration+1].res[1]];
    context.uniform2iv(this._uniformLocations.u_writeOffset, writeOffset);
    context.uniform2iv(this._uniformLocations.u_writeSize, writeSize);

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



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Quad; });
class Quad {
  constructor(context) {
    this._pos = this.getQuadPositions();
    this._tex = this.getQuadTexCoords();

    this._buffers = this.prepareBuffers(context, this._pos, this._tex);
    this._vertexArray = this.prepareVertexArray(context, this._buffers);
  }

  get pos() {
    return this._pos;
  }

  set pos(pos) {
    this._pos = pos
  }

  get tex() {
    return this._tex;
  }

  set tex(tex) {
    this._tex = tex;
  }

  get buffers() {
    return this._buffer;
  }

  set buffers(buffer) {
    this._buffer = buffer;
  }

  get vertexArray() {
    return this._vertexArray;
  }

  set vertexArray(vertexArray) {
    this._vertexArray = vertexArray;
  }

  prepareBuffers(context, pos, tex) {
    var vertexPosBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, vertexPosBuffer);
    context.bufferData(context.ARRAY_BUFFER, pos, context.STATIC_DRAW);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    var vertexTexBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, vertexTexBuffer);
    context.bufferData(context.ARRAY_BUFFER, tex, context.STATIC_DRAW);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    return {
      pos: vertexPosBuffer,
      tex: vertexTexBuffer
    }
  }

  prepareVertexArray(context, buffers) {
    var vertexArray = context.createVertexArray();
    context.bindVertexArray(vertexArray);

    var vertexPosIdx = 0;
    context.bindBuffer(context.ARRAY_BUFFER, buffers.pos);
    context.vertexAttribPointer(vertexPosIdx, 4, context.FLOAT, false, 0, 0);
    context.enableVertexAttribArray(vertexPosIdx);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    var vertexTexIdx = 1;
    context.bindBuffer(context.ARRAY_BUFFER, buffers.tex);
    context.vertexAttribPointer(vertexTexIdx, 2, context.FLOAT, false, 0, 0);
    context.enableVertexAttribArray(vertexTexIdx);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    context.bindVertexArray(null);

    return vertexArray;
  }

  createVertexLayout() {
    // TODO: given a hash config, return new vertex layout using these buffers
  }

  getQuadPositions() {
    return new Float32Array([
      -1.0, -1.0, 0.0, 1.0,
      1.0, -1.0, 0.0, 1.0,
      1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0, 1.0,
      -1.0, 1.0, 0.0, 1.0,
      -1.0, -1.0, 0.0, 1.0
    ])
  }

  getQuadTexCoords() {
    return new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0
    ])
  }
}




/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LinePlot; });
class LinePlot {
  constructor(context, size, options = {}) {
    this._size = size;
    this._rolling = options.rolling ? true : false;
    this._currentIndex = size - 1;

    this._lineColor = options.lineColor || vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this._lineWidth = options.lineWidth || 10;

    this._pos = new Float32Array(size * 2);
    this._max = options.max || { value: 1, dynamic: false };
    this._min = options.min || { value: 0, dynamic: false };

    if (this._max.dynamic) {
      this._max.index = 0;
      this._max.age = 0;
      this._max.expiresAfter = options.max.expiresAfter || this._size;
    }
    if (this._min.dynamic) {
      this._min.index = 0;
      this._min.age = 0;
      this._min.expiresAfter = options.min.expiresAfter || this._size;
    }

    this._buffers = this.prepareBuffers(context, this._pos);
    this._vertexArray = this.prepareVertexArray(context, this._buffers);

    this._program = options.program;
    this.setUniformLocations(context);

    this._transformProgram = options.transformProgram;
    this._transformFeedback = context.createTransformFeedback();
    this._transformVertexArray = this.prepareTransformVertexArray(context, this._buffers);
    this._transformUniformLocations = {};
    this.setTransformUniformLocations(context);

    this._drawVertexArray = this.prepareDrawVertexArray(context, this._buffers);
  }

  getDataPoint(n) {
    return [
      this._pos[n * 2],
      this._pos[n * 2 + 1]
    ];
  }

  setDataPoint(n, d) {
    this._pos[n * 2] = d[0];
    this._pos[n * 2 + 1] = d[1];
  }

  get pos() { return this._pos; }
  set pos(pos) { this._pos = pos; }
  get buffers() { return this._buffers; }
  set buffers(buffers) { this._buffers = buffers; }
  get vertexArray() { return this._vertexArray; }
  set vertexArray(vertexArray) { this._vertexArray = vertexArray; }

  get program() { return this._program; }
  set program(program) { this._program = program; }
  get transformProgram() { return this._transformProgram; }
  set transformProgram(transformProgram) { this._transformProgram = transformProgram; }

  get uniformLocations() { return this._uniformLocations; }
  get transformUniformLocations() { return this._transformUniformLocations; }

  setUniformLocations(context) {
    this._uniformLocations = {
      u_lineColor: context.getUniformLocation(this._program, 'u_lineColor')
    }
  }

  setTransformUniformLocations(context) {
    this._transformUniformLocations = {
      u_lineWidth: context.getUniformLocation(this._transformProgram, 'u_lineWidth'),
      u_projection: context.getUniformLocation(this._transformProgram, 'u_projection')
    }
  }

  encodeTransform(context, options = {}) {
    // update data in buffers
    this.writeBuffers(context);

    context.enable(context.RASTERIZER_DISCARD);
    context.bindTransformFeedback(context.TRANSFORM_FEEDBACK, this._transformFeedback);
    context.useProgram(this._transformProgram);
    context.bindBufferBase(context.TRANSFORM_FEEDBACK_BUFFER, 0, this._buffers.posTransformed);
    context.bindVertexArray(this._vertexArray);

    var scaledWidth = this._lineWidth / options.resolution[1];
    context.uniform1f(this._transformUniformLocations.u_lineWidth, scaledWidth); // scale for resolution
    context.uniformMatrix4fv(this._transformUniformLocations.u_projection, true, this.getTransformationMatrix());

    context.beginTransformFeedback(context.POINTS);
    context.drawArraysInstanced(context.POINTS, 0, this._size, 1);
    context.endTransformFeedback();
    context.disable(context.RASTERIZER_DISCARD);

    context.bindBufferBase(context.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    context.bindVertexArray(null);
    context.useProgram(null);
  }

  encode(context, options = {}) {
    // TODO: vertex shader to transform x/y from that function's space to the screen space

    context.useProgram(this._program);

    context.viewport(0.0, 0.0, options.resolution[0], options.resolution[1]);

    if (options.beforeEncode) {
      options.beforeEncode(context, this);
    }

    if (options.encodeClear) {
      options.encodeClear(context, this);
    }

    context.uniform4fv(this._uniformLocations.u_lineColor, this._lineColor);
    context.bindVertexArray(this._drawVertexArray);

    if (options.encodeDraw) {
      options.encodeDraw(context,this);
    } else {
      context.drawArrays(context.TRIANGLE_STRIP, 0, this._size * 2);
    }

    if (options.afterEncode) {
      options.afterEncode(context, this);
    }
  }

  increment() {
    this._currentIndex = (this._currentIndex + 1) % this._size;
  }

  push(data) {
    this.increment();
    this.setDataPoint(this._currentIndex, data);

    this.updateMax(data[1]);
    this.updateMin(data[1]);
  }

  updateMax(value) {
    if (this._max.dynamic) {
      if (value > this._max.value) {
        this._max.value = value;
        this._max.index = this._currentIndex;
        this._max.age = 0;
      } else {
        if (this._max.age > this._max.expiresAfter) {
          // find the new max & index
          var newMax = Number.NEGATIVE_INFINITY;
          var newAge = 0;
          var newIndex = this._size - 1;

          for (var i = 0; i < this._size; i++) {
            var thisIndex = (this._currentIndex + i) % this._size;
            var data = this.getDataPoint(thisIndex);
            if (data[1] > newMax) {
              newMax = data[1];
              newAge = this._size - i - 1;
              newIndex = i;
            }
          }

          this._max.value = newMax;
          this._max.age = newAge;
          this._max.index = newIndex;
        } else {
          this._max.age++;
        }
      }
    } else {
      this._max.value = (value > this._max ? value : this._max.value);
    }
  }

  updateMin(value) {
    if (this._min.dynamic) {
      if (value < this._min.value) {
        this._min.value = value;
        this._min.index = this._currentIndex;
        this._min.age = 0;
      } else {
        if (this._min.age > this._min.expiresAfter) {
          // find the new min & index
          var newMin = Number.POSITIVE_INFINITY;
          var newAge = 0;
          var newIndex = this._size - 1;

          for (var i = 0; i < this._size; i++) {
            var thisIndex = (this._currentIndex + i) % this._size;
            var data = this.getDataPoint(thisIndex);
            if (data[1] < newMin) {
              newMin = data[1];
              newAge = this._size - i - 1;
              newIndex = i;
            }
          }

          this._min.value = newMin;
          this._min.age = newAge;
          this._min.index = newIndex;
        } else {
          this._min.age++;
        }
      }
    } else {
      this._min.value = (value < this._min ? value : this._min.value);
    }
  }

  writeBuffers(context) {
    context.bindBuffer(context.ARRAY_BUFFER, this._buffers.pos);

    // rearrange the circular buffer so it can be drawn with triangle strips
    var posCopy = new Float32Array(this._size * 2);
    posCopy.set(this._pos.subarray((this._currentIndex + 1) * 2, this._size * 2), 0);
    posCopy.set(this._pos.subarray(0, (this._currentIndex + 1) * 2), (this._size - this._currentIndex - 1) * 2);
    context.bufferData(context.ARRAY_BUFFER, posCopy, context.STATIC_DRAW);

    context.bindBuffer(context.ARRAY_BUFFER, null);
  }

  prepareBuffers(context, pos) {
    var vertexPosBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, vertexPosBuffer);
    context.bufferData(context.ARRAY_BUFFER, pos, context.STATIC_DRAW);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    var vertexPosTransformedBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, vertexPosTransformedBuffer);
    context.bufferData(context.ARRAY_BUFFER, this._size * 8 * Float32Array.BYTES_PER_ELEMENT, context.STREAM_COPY);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    return {
      pos: vertexPosBuffer,
      posTransformed: vertexPosTransformedBuffer,
    };
  }

  prepareVertexArray(context, buffers) {
    var vertexArray = context.createVertexArray();
    context.bindVertexArray(vertexArray);

    var vertexPosIdx = 0;
    context.bindBuffer(context.ARRAY_BUFFER, buffers.pos);
    context.vertexAttribPointer(vertexPosIdx, 2, context.FLOAT, false, 0, 0);
    context.enableVertexAttribArray(vertexPosIdx);

    context.bindBuffer(context.ARRAY_BUFFER, null);
    context.bindVertexArray(null);

    return vertexArray;
  }

  prepareTransformVertexArray(context, buffers) {
    var vertexArray = context.createVertexArray();
    context.bindVertexArray(vertexArray);

    var vertexPosIdx = 0;
    context.bindBuffer(context.ARRAY_BUFFER, buffers.posTransformed);
    context.vertexAttribPointer(vertexPosIdx, 4, context.FLOAT, false, 32, 0);
    context.enableVertexAttribArray(vertexPosIdx);

    var vertexPosIdx2 = 1;
    context.vertexAttribPointer(vertexPosIdx2, 4, context.FLOAT, false, 32, 16);
    context.enableVertexAttribArray(vertexPosIdx2);

    context.bindBuffer(context.ARRAY_BUFFER, null);
    context.bindVertexArray(null);

    return vertexArray;
  }

  prepareDrawVertexArray(context, buffers) {
    var vertexArray = context.createVertexArray();
    context.bindVertexArray(vertexArray);

    var vertexPosIdx = 0;
    context.bindBuffer(context.ARRAY_BUFFER, buffers.posTransformed);
    context.vertexAttribPointer(vertexPosIdx, 4, context.FLOAT, false, 0, 0);
    context.enableVertexAttribArray(vertexPosIdx);

    context.bindBuffer(context.ARRAY_BUFFER, null);
    context.bindVertexArray(null);

    return vertexArray;
  }

  getTransformationMatrix() {
    // TODO: update to draw a scanning graph

    var tCurrent = this.getDataPoint(this._currentIndex)[0];
    var tEarliest = this.getDataPoint((this._currentIndex + 1) % this._size)[0];
    var tRange = tCurrent - tEarliest;
    var tMid = tEarliest + tRange/2;

    var yMin = this._min.value;
    var yMax = this._max.value;
    var yRange = yMax - yMin;

    var translate = mat4.fromValues(
      2/tRange, 0, 0, 2*(-tEarliest - tRange/2)/tRange,
      0, 2/yRange, 0, 2*(-yMin - yRange/2)/yRange,
      0, 0, 1, -0.0001,
      0, 0, 0, 1
    );

    return translate;
  }
}



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__platform_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__audio_js__ = __webpack_require__(6);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__platform_js__["a"]; });





/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PlatformUtil; });
class PlatformUtil {

  static appendLabel(container, message, options = { icon: "info-sign", bsColor: "danger" }) {
    var bsGlyph = options.bsGlyph, bsColor = options.bsColor;
    var labelSpan = document.createElement('span');
    labelSpan.classList.add('label', `label-${bsColor}`, 'animation-alert');

    var glyph = `<i class="fa fa-lg fa-info-circle"></i>&nbsp;`;
    labelSpan.innerHTML = glyph + message;

    container.appendChild(labelSpan);
  }

  static checkEs6() {
    try {
      return ('function' === typeof Map)
    } catch (e) {
      return false;
    }
  }

  static checkMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  /**
   * for some reason, the canvas on te.xel.io ends up being ~10 px too small for its
   * container. this appears to be a bug that happens in Chrome (not Firefox AFAIK) but
   * only in conjunction with the CSS layout i'm using...
   *
   * @param container the canvas container
   * @param canvas the canvas in the te.xel.io layout
   * @param uiBar the bottom ui bar
   */
  static fixCanvasUIBar(container, canvas, navbar) {
    var canvasHeight = window.getComputedStyle(canvas).height;
    var containerHeight = window.getComputedStyle(container).height;

    canvasHeight = parseFloat(canvasHeight.substr(0, canvasHeight.length - 2));
    containerHeight = parseFloat(containerHeight.substr(0, containerHeight.length - 2));

    var shadowPaddingHeight = canvasHeight - containerHeight;
    if (shadowPaddingHeight < 0) {
      navbar.style.marginTop = `${shadowPaddingHeight}px`;
    }
  }

}



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MicService */
// TODO: construct basic webaudio mic service
// TODO: decide how to connect web audio nodes together for easy Mic/FFT => ScriptNode => ArrayBuffer

class MicService {

}



/***/ })
/******/ ]);
//# sourceMappingURL=2017-06-29-animating-the-gradient.js.map