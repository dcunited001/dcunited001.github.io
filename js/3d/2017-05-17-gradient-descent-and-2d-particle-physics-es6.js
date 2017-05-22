"use strict";

function createShader(gl, source, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

window.createProgram = function (gl, vertexShaderSource, fragmentShaderSource, defines = {}) {
  var shaderPrefix = "#version 300 es\n";
  shaderPrefix += "#extension EXT_color_buffer_float : enable\n"; // not supported in chrome

  var precisionPrefix = `
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    precision highp usampler2D;
    precision highp isampler2D;
    `;

  var program = gl.createProgram();
  vertexShaderSource = shaderPrefix + expandDefines(defines) + precisionPrefix + vertexShaderSource;
  fragmentShaderSource = shaderPrefix + expandDefines(defines) + precisionPrefix + fragmentShaderSource;

  var vshader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  var fshader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  gl.attachShader(program, vshader);
  gl.deleteShader(vshader);
  gl.attachShader(program, fshader);
  gl.deleteShader(fshader);
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

window.loadImage = function (url, onload) {
  var img = new Image();
  img.src = url;
  img.onload = function () {
    onload(img);
  };
  return img;
};

window.loadImages = function (urls, onload) {
  var imgs = [];
  var imgsToLoad = urls.length;

  function onImgLoad() {
    if (--imgsToLoad <= 0) {
      onload(imgs);
    }
  }

  for (var i = 0; i < imgsToLoad; ++i) {
    imgs.push(loadImage(urls[i], onImgLoad));
  }
};

window.loadObj = function (url, onload) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'text';
  xhr.onload = function (e) {
    var mesh = new OBJ.Mesh(this.response);
    onload(mesh);
  };
  xhr.send();
};

function runWebGL() {

  function updateTime() {
    lastFrameStart = currentTime;
    currentTime = Date.now();
    elapsedTime = currentTime - startTime;
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

// =======================================
// Particles
// =======================================

  var PARTICLE_MAX = parseInt(document.getElementById('particle-count').max);
  var PARTICLE_WIDTH = 1024;
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
    particleAttributes;

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

  particleAttributes = [0,1,2].map((f) => {
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
      generateFloat32Randoms(particleResolution[0], particleResolution[1], 4, 0.01, 0.10));

    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  });

  particlePonger.registerTextures('particleRandoms', particleRandomsAttachments);
  particlePonger.registerTextures('particles', particleAttachments);
  particlePonger.registerTextures('particleAttributes', particleAttributes);

  var particleFboConfig = {
    particleRandoms: {
      colorAttachment: gl.COLOR_ATTACHMENT0
    },
    particles: {
      colorAttachment: gl.COLOR_ATTACHMENT1
    },
    particleAttributes: {
      colorAttachment: gl.COLOR_ATTACHMENT2
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
      context.uniform4iv(rpParticles.uniformLocations.u_randomSeed, uniforms.randomSeed);
      context.uniform1f(rpParticles.uniformLocations.u_particleSpeed, uniforms.particleSpeed);
      context.uniform4fv(rpParticles.uniformLocations.u_deltaTime, uniforms.deltaTime);
      context.uniform1i(rpParticles.uniformLocations.u_physicsMethod, uniforms.physicsMethod);
      context.uniform1i(rpParticles.uniformLocations.s_particleRandoms, 0);
      context.uniform1i(rpParticles.uniformLocations.s_particles, 1);
      context.uniform1i(rpParticles.uniformLocations.s_particleAttributes, 2);
      context.uniform1i(rpParticles.uniformLocations.s_particleForces, 3);
    },
    encodeTextures: (context, uniforms, ops) => {
      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, ops.particleRandoms);
      context.bindSampler(0, samplerNearest);

      context.activeTexture(context.TEXTURE1);
      context.bindTexture(context.TEXTURE_2D, ops.particles);
      context.bindSampler(1, samplerNearest);

      context.activeTexture(context.TEXTURE2);
      context.bindTexture(context.TEXTURE_2D, ops.particleAttributes);
      context.bindSampler(2, samplerNearest);

      context.activeTexture(context.TEXTURE3);
      context.bindTexture(context.TEXTURE_2D, ops.particleForces);
      context.bindSampler(3, samplerNearest);
    },
    encodeDraw: (context, uniforms, ops) => {
      context.drawBuffers([
        context.COLOR_ATTACHMENT0,
        context.COLOR_ATTACHMENT1,
        context.COLOR_ATTACHMENT2
      ]);

      context.bindVertexArray(anyQuad.vertexArray);
      context.drawArrays(context.TRIANGLES, 0, 6);
    }
  });

  rpParticles.setUniformLocations(gl, [
    'u_resolution',
    'u_randomSeed',
    'u_particleSpeed',
    'u_deltaTime',
    'u_physicsMethod',
    's_particleRandoms',
    's_particles',
    's_particleAttributes',
    's_particleForces'
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
      context.uniform1i(rpFields.uniformLocations.u_deferGradientCalc, (uniforms.deferGradientCalc ? 1 : 0));
      context.uniform1i(rpFields.uniformLocations.u_circularFieldEffect, (uniforms.circularFieldEffect ? 1 : 0));
      context.uniform1i(rpFields.uniformLocations.u_forceCalcInGlPointSpace, (uniforms.forceCalcInGlPointSpace ? 1 : 0));
      context.uniform1i(rpFields.uniformLocations.s_particles, 0);
    },
    encodeTextures: (context, uniforms, ops) => {
      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, ops.particles);
      context.bindSampler(0, samplerNearest);

      // TODO: add particleAttributes texture (any need for color here?)
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
// Render Pass: Final
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
    's_repelField',
    's_repelFieldGradient'
  ]);

// =======================================
// UI Controls
// =======================================

  var particleCount, particleSpeed, particleMass;
  var fieldSize, rCoefficient, maxFieldLines;
  var renderTexture, physicsMethod, physicsMethods;
  var deferGradientCalc, fractRenderValues, renderMagnitude, circularFieldEffect, forceCalcInGlPointSpace, scaleRenderValues;

  function uiControlUpdate() {
    particleCount = document.getElementById('particle-count').value;
    particleSpeed = document.getElementById('particle-speed').value;
    particleMass = document.getElementById('particle-mass').value;
    rCoefficient = document.getElementById('r-coefficient').value;
    fieldSize = document.getElementById('field-size').value;
    maxFieldLines = document.getElementById('max-field-lines').value;

    deferGradientCalc = document.getElementById('defer-gradient-calc').checked;
    fractRenderValues = document.getElementById('fract-render-values').checked;
    scaleRenderValues = document.getElementById('scale-render-values').checked;
    renderMagnitude = document.getElementById('render-magnitude').checked;
    circularFieldEffect = document.getElementById('circular-field-effect').checked;

    forceCalcInGlPointSpace = document.getElementById('calc-force-in-glpoint-space').checked;
    if (forceCalcInGlPointSpace) {
      rCoefficient /= 10;
    }

    var renderTextureRadios = document.getElementsByName('render-texture');
    renderTexture = [0,1,2].reduce((a,i) => renderTextureRadios[i].checked ? i : a, 0);

    var physicsMethodRadios = document.getElementsByName('physics-method');
    physicsMethod = [0,1,2].reduce((a,i) => physicsMethodRadios[i].checked ? i : a, 0);
    physicsMethods = {
      brownian: 0,
      splat: 1,
      gradient: 2
    }
  }

  var anyQuad = new Quad(gl);

  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  gl.viewport(0, 0, renderResolution[0], renderResolution[1]);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var framecount = 0;

  var startTime = Date.now(),
    currentTime = startTime,
    elapsedTime = currentTime - startTime,
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
    uiControlUpdate();

    if (framecount % 30 == 0) {
      console.log(deltaT);
    }

    if (physicsMethod == physicsMethods.splat) {
      var forceSplatUniforms = {
        resolution: particleResolution,
        rCoefficient: rCoefficient
      };

      rpForceSplat.encode(gl, forceSplatUniforms, {
        framebuffer: forceSplatFbo,
        particles: particlePonger.getCurrent('particles'),
        particleCount: particleCount
      });
    }

    var particleUniforms = {
      resolution: particleResolution,
      randomSeed: makeIntRandomUniforms(),
      particleSpeed: particleSpeed,
      deltaTime: deltaT,
      physicsMethod: physicsMethod
    };

    rpParticles.encode(gl, particleUniforms, {
      framebuffer: particlePonger.getCurrentFbo(),
      particleRandoms: particlePonger.getCurrent('particleRandoms'),
      particles: particlePonger.getCurrent('particles'),
      particleAttributes: particlePonger.getCurrent('particleAttributes'),
      particleForces: forceSplatTexture
    });

    particlePonger.increment();

    var fieldsUniforms = {
      resolution: renderResolution,
      fieldSize: fieldSize,
      rCoefficient: rCoefficient,
      deferGradientCalc: deferGradientCalc,
      circularFieldEffect: circularFieldEffect,
      forceCalcInGlPointSpace: forceCalcInGlPointSpace
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

    //if (createDebugTexture) {
    //  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fieldPonger.getCurrentFbo());
    //  gl.readBuffer(gl.COLOR_ATTACHMENT0);
    //  gl.readPixels(0, 0, renderResolution[0], renderResolution[1], gl.RGBA, gl.FLOAT, debugPixels);
    //  renderDebugTexture(debugPixels);
    //}

    var renderFieldsUniforms = {
      resolution: renderResolution,
      rCoefficient: rCoefficient,
      fractRenderValues: fractRenderValues,
      scaleRenderValues: scaleRenderValues,
      renderMagnitude: renderMagnitude,
      maxFieldLines: maxFieldLines,
      renderTexture: renderTexture
    };

    var renderFieldsOptions = {
      framebuffer: null,
      repelField: fieldPonger.getCurrent('repelField'),
      repelFieldGradient: gradientTexture
    };

    rpRenderFields.encode(gl, renderFieldsUniforms, renderFieldsOptions);

    // TODO: mipmap aggregate on particle texture:
    // - sum aggregate instantaneous velocities to measure a 'temperature'
    // - https://en.wikipedia.org/wiki/Thermal_velocity
    // - then plot the scalar thermal velocity value from the simulation into a D3 chart

    requestAnimationFrame(render);
  }

  render();

}

var createDebugTexture = false;


window.onload = function() {
  runWebGL();

};