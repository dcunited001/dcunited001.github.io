'use strict';

//TODO: setup gradient to extend 16 directions outward

//TODO: emoji texture atlas for particles
// - set particle to render as emoji
// - emoji based state machines emerge with id's for states
// - exchange states with neighbors

// TODO: basic implementation of emoji-based probabilistic turing machine
// - particles retain state history

// TODO: textures for hard effects on the field the gradients share
// - also can randomly initialize some constraints (pic of labyrinth, etc)

// TODO: bar simulation: modify particle behaviors with third color channel on shared field
// - the third color is set in a texture applied to the final gradient for particles
//   - this third color strongly modifies the behavior for particles with strong degree of alcoholism
// - this forces the particle to gravitate towards the third color
//   - when the particle is in a strong enough region of the third color, they get a refill
// - this causes a state change from not-drinking to drinking
//   - particles that are drinking/drunk are represented by different emojis from the texture atlas
//   - as time runs onward, their current drink level gradually flows into their current alcohol level
// - the current alcohol level affects the fluidity and temperature of the particle
//
// - particle attributes:
// - float: alcoholism - degree to "need" alcohol
// - float: current drink level
// - float: current alcohol level
// - integer: particle state (drinking/not drinking)

// TODO: marijuana dealing simulation: similar to the bar simulation, but with types of particles
// - there are 50% consumer particles, 1% dealer particles and the rest do not smoke
// - this simulation requires a quadtree and forming/maintaining a graph of locally adjacent particles
// - particles can exchange money for drugs and drugs for money
// - consumers are automatically aware of which other particles are also consumers
// - consumer particles maintain a single-register memory of the last time they found a dealer
//   - this consists of: (x, y, t, dealer_id) where t is the time since purchase
//
// - the main challenge to this simulation (and most others) is configuring parameters that result in
//   a near-equilibrium, where the higher-order params/events are always approaching equilibrium, but
//   never quite reach it
// - the architectural challenge to this simulation is getting the quadtree and/or delauney triangulation
//   graph to be updated by the GPU (which is easier, given a consistent particle size)
//   - there are other ways to expose information about neighboring particles
//
// - the most interesting implications of this simulation is information radiation and time-relevance
//   - the particles develop and understanding of possible opportunities in their environment based
//     on sharing and collecting information
//
// dealer type attributes:
// - float: likelyhood to make a deal
// - integer: finances
//
// consumer type attributes:
// - float: likelyhood to make a deal
// - integer: finances
// - integer: state (searching/smoking/not smoking)
// - memory of last purchase (x, y, t, dealer_id)

// - add noise to final color mapping as an effect
//   - the mapping can be made to distorct shadows


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

function startTiming() {
  var startTime = Date.now(),
    currentTime = startTime,
    elapsedTime = currentTime - startTime,
    lastFrameStart = currentTime,
    lastFrameTime = currentTime - lastFrameStart;

  return startTime, currentTime, elapsedTime, lastFrameStart, lastFrameTime;
}

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

// TODO: use samplers

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
    return uniformLocations
  }

  encode(context, uniforms, options = {}) {
    var ops = Object.assign({}, this.options, options);

    context.useProgram(this.program);

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

    checkFbStatus(context);

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

  checkFbStatus(context) {
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
      var fbo = context.createFramebuffer();
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, fbo);
      for (var k in Object.keys(fboConfig)) {
        context.framebufferTexture2D(context.DRAW_FRAMEBUFFER, fboConfig.colorAttachment, context.TEXTURE_2D, this.getPrev(k), 0);
      }
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, null);
      this._framebuffers.push(newFbo);
    }
  }

  registerTextures(k, texturesOrMonoid) {
    this._textures[k] = texturesOrMonoid;
  }

  getTexture(k, i, ...args) {
    var textures = this._textures[k];
    if (textures !== undefined) {
      console.error(`PingPongProvider: key ${k} is undefined`);
    } else {
      if (textures instanceof Array) {
        return textures[i];
      } else {
        return textures(this, i, ...args);
      }
    }
  }

  getCurrent(k, ...args) {
    var id = getCurrentId();
    return getTexture(k, id, ...args);
  }

  getNext(k,  ...args) {
    var id = getNextId();
    return getTexture(k, id, ...args);
  }

  getPrev(k, ...args) {
    var id = getPrevId();
    return getTexture(k, id, ...args);
  }

  getCurrentFbo() {
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
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LESS);

var renderResolution = vec2.fromValues(gl.drawingBufferWidth, gl.drawingBufferHeight);

var UINT32_MAX = (2 ** 32) - 1;
var INT32_MAX = (2 ** 31) - 1;

// =======================================
// GLSL Programs
// =======================================

var programParticles = createProgram(gl,
  document.getElementById('vsPass').textContent,
  document.getElementById('fsParticle').textContent);

var programParticleId = createProgram(gl,
  document.getElementById('vsParticleId').textContent,
  document.getElementById('fsParticleId').textContent);

//var programField = createProgram(gl, document.getElementById('vsPass').textContent, document.getElementById('fsParticleId').textContent);
//var programRender = createProgram(gl, document.getElementById('vsPass').textContent, document.getElementById('fsRender').textContent);
//var programRenderDebug = createProgram(gl.document.getElementById('vsPass').textContent, document.getElementById('fsRenderDebug').textContent);

// =======================================
// Particles
// =======================================

var PARTICLE_MAX = parseInt(document.getElementById('particle-count').max);
var particleResolution = vec2(PARTICLE_WIDTH, PARTICLE_MAX/PARTICLE_WIDTH);

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
  particleColors;

particleRandomsAttachments = [0,1,2].map((f) => {
  gl.activeTexture(gl.TEXTURE0);
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32I, particleResolution[0], particleResolution[1]);
  gl.texSubImage2D(context.TEXTURE_2D,
    0,
    0, // x offset
    0, // y offset
    particleResolution[0],
    particleResolution[1],
    context.RGBA_INTEGER,
    context.INT,
    generateInt32Randoms(particleResolution[0], particleResolution[1]));

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
    context.RGBA,
    context.FLOAT,
    generateFloat32Randoms(particleResolution[0], particleResolution[1], 4, -0.5, 0.5));

  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
});

gl.activeTexture(gl.TEXTURE0);
particleColors = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, particleColors);
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, particleResolution[0], particleResolution[1]);
gl.texSubImage2D(gl.TEXTURE_2D,
  0,
  0, // x offset
  0, // y offset
  particleResolution[0],
  particleResolution[1],
  context.RGBA,
  context.FLOAT,
  generateFloat32Randoms(particleResolution[0], particleResolution[1], 4, 0.25, 0.75));

particlePonger.registerTextures('particleRandoms', particleRandomsAttachments);
particlePonger.registerTextures('particles', particleAttachments);
// TODO: setup framebuffers

var particleFboConfig = {
  particleRandoms: {
    colorAttachment: gl.COLOR_ATTACHMENT0,
  },
  particles: {
    colorAttachment: gl.COLOR_ATTACHMENT1
  }
};

particlePonger.initFramebuffers(gl, particleFboConfig);

// =======================================
// Particle Id Texture
// =======================================

// hashtag #RelationalAlgebra

gl.activeTexture(gl.TEXTURE0);
var particleIdTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, particleIdTexture);
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32I, renderResolution[0], renderResolution[1]);
gl.bindTexture(gl.TEXTURE_2D, null);

var fboParticleIds = gl.createFramebuffer();
gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fboParticleIds);
gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, particleIdTexture, 0);
gl.clearBufferiv(gl.COLOR, 0, new Int32Array([0,0,0,0]));
gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);

// =======================================
// Fields
// =======================================

var fieldPonger = new PingPongProvider({max: 3});

var fieldRForceAttachments,
  fieldRCompAttachments,
  fieldAForceAttachments,
  fieldACompAttachments;

fieldRForceAttachments = [0,1,2].map((i) => {
  gl.activeTexture(gl.TEXTURE0);
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, renderResolution[0], renderResolution[1]);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
});

fieldRCompAttachments = [0,1,2].map((i) => {
  gl.activeTexture(gl.TEXTURE0);
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, renderResolution[0], renderResolution[1]);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
});

fieldAForceAttachments = [0,1,2].map((i) => {
  gl.activeTexture(gl.TEXTURE0);
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, renderResolution[0], renderResolution[1]);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
});

fieldACompAttachments = [0,1,2].map((i) => {
  gl.activeTexture(gl.TEXTURE0);
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, renderResolution[0], renderResolution[1]);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
});

fieldPonger.registerTextures('rForce', fieldRForceAttachments);
fieldPonger.registerTextures('rComp', fieldRCompAttachments);
fieldPonger.registerTextures('aForce', fieldAForceAttachments);
fieldPonger.registerTextures('aComp', fieldACompAttachments);

var fieldPongerFboConfig = {
  rForce: { colorAttachment: gl.COLOR_ATTACHMENT0 },
  rComp: { colorAttachment: gl.COLOR_ATTACHMENT1 },
  aForce: { colorAttachment: gl.COLOR_ATTACHMENT2 },
  aComp: { colorAttachment: gl.COLOR_ATTACHMENT3 }
};

fieldPonger.initFramebuffers(gl, fieldPongerFboConfig);

// TODO: clear framebuffer attachments
// - these have to be clear once I'm updating particle positions with them

// =======================================
// Gradients
// =======================================

// TODO: setup textures/fbo's for gradients?
// - do these need to pingpong?
//   - only if i want to store a history

// =======================================
// Texture Samplers
// =======================================

// TODO: attach samplers to render pass object

var nearestSampler = gl.createSampler();
gl.samplerParameteri(nearestSampler, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.samplerParameteri(nearestSampler, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.samplerParameteri(nearestSampler, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.samplerParameteri(nearestSampler, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

var linearSampler = gl.createSampler();
gl.samplerParameteri(linearSampler, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.samplerParameteri(linearSampler, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.samplerParameteri(linearSampler, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.samplerParameteri(linearSampler, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

// =======================================
// Render Pass: Particles
// =======================================

var rpParticles = new RenderPass(programParticles, {
  beforeEncode: (context, uniforms, ops) => {
    context.blendFunc(gl.ONE, gl.ZERO);
    context.bindFramebuffer(context.DRAW_FRAMEBUFFER, ops.framebuffer);
    context.viewport(0, 0, uniforms.resolution[0], uniforms.resolution[1]);
  },
  encodeUniforms: (context, uniforms, ops) => {
    context.uniform2fv(rpParticles.uniformLocations.u_resolution, uniforms.resolution);
    context.uniform4iv(rpParticles.uniformLocations.u_randomSeed, uniforms.randomSeed);
    context.uniform1f(rpParticles.uniformLocations.u_particleSpeed, uniforms.particleSpeed);
    context.uniform4fv(rpParticles.uniformLocations.u_deltaTime, uniforms.deltaTime);
    context.uniform1i(rpParticles.uniformLocations.s_particleRandoms, 0);
    context.uniform1i(rpParticles.uniformLocations.s_particles, 1);
  },
  encodeTextures: (context, uniforms, ops) => {
    context.activeTexture(context.TEXTURE0);
    context.bindTexture(context.TEXTURE_2D, ops.particleRandoms);
    context.bindSampler(0, nearestSampler);

    context.activeTexture(context.TEXTURE1);
    context.bindTexture(context.TEXTURE_2D, ops.particles);
    context.bindSampler(1, nearestSampler);
  },
  encodeDraw: (context, uniforms, ops) => {
    context.drawBuffers([
      context.COLOR_ATTACHMENT0,
      context.COLOR_ATTACHMENT1
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
  's_particleRandoms',
  's_particles'
]);

// =======================================
// Render Pass: Particle ID's
// =======================================

var rpParticleIds = new RenderPass(programParticleId, {
  beforeEncode: (context, uniforms, ops) => {
    context.blendFunc(gl.ONE, gl.ZERO);
    context.bindFramebuffer(context.DRAW_FRAMEBUFFER, ops.framebuffer);
    context.viewport(0, 0, uniforms.resolution[0], uniforms.resolution[1]);
  },
  encodeUniforms: (context, uniforms, ops) => {
    context.uniform2fv(rpParticleIds.uniformLocations.u_resolution, uniforms.resolution);
    context.uniform1i(rpParticleIds.uniformLocations.s_particles, 0);
  },
  encodeTextures: (context, uniforms, ops) => {
    context.activeTexture(context.TEXTURE0);
    context.bindTexture(context.TEXTURE_2D, ops.particles);
    context.bindSampler(0, nearestSampler);
  },
  encodeDraw: (context, uniforms, ops) => {
    context.drawBuffers([
      context.COLOR_ATTACHMENT0
    ]);

    gl.bindVertexArray(particleVertexArray);
    gl.drawArrays(gl.POINTS, 0, options.particleCount);
  }
});

rpParticleIds.setUniformLocations(gl, [
  'u_resolution',
  's_particles'
]);

// =======================================
// Render Pass: Fields
// =======================================


// =======================================
// Render Pass: Gradient
// =======================================


// =======================================
// Render Pass: Final
// =======================================

//var rpRender = new RenderPass(programParticleId, {
//  beforeEncode: (context, uniforms, ops) => {
//
//  },
//  encodeUniforms: (context, uniforms, ops) => {
//
//  },
//  encodeTextures: (context, uniforms, ops) => {
//
//  },
//  encodeClear: (context, uniforms, ops) => {
//
//  },
//  encodeDraw: (context, uniforms, ops) => {
//
//  }
//});

// TODO: rpRenderDebug

var rpDebugParticleIds = new RenderPass(programDebugParticleIds, {

});

// =======================================
// UI Controls
// =======================================
var particleSpeed, particleCount;
var rForceEnabled, rCompEnabled, aForceEnabled, aCompEnabled;

function uiControlUpdate() {
  particleSpeed = document.getElementById('particle-speed').value;
  particleCount = document.getElementById('particle-count').value;
  rForceEnabled = document.getElementById('chk-r-force').value;
  rCompEnabled = document.getElementById('chk-r-components').value;
  aForceEnabled = document.getElementById('chk-a-force').value;
  aCompEnabled = document.getElementById('chk-a-components').value;
}

var anyQuad = new Quad(gl);

// TODO: initialize samplers

var startTime, currentTime, elapsedTime, lastFrameStart, lastFrameTime, deltaT;

gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
gl.viewport(0, 0, renderResolution[0], renderResolution[1]);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// (1) get brownian motion rendering
// (2) get particle attributes rendering, joined via particle id's
// (3) generate repulsive force and render
// (4) update particle positions with r-force and balance
// (5) generate a-force
// (6) balance constants
// (7) focus on animation (emoji texture-atlas)

function render() {
  updateTime();
  deltaT = updateDeltaT(deltaT, lastFrameTime);

  var particleUniforms = {
    resolution: particleResolution,
    randomSeed: makeIntRandomUniforms(),
    particleSpeed: particleSpeed,
    deltaTime: deltaT
  };

  rpParticles.encode(gl, particleUniforms, {
    framebuffer: particlePonger.getCurrentFbo(),
    particleRandoms: particlePonger.getCurrent('particleRandoms'),
    particles: particlePonger.getCurrent('particles')
  });

  particlePonger.increment();

  var particleIdsUniforms = {
    resolution: renderResolution
  };

  rpParticleIds.encode(gl, particleIdsUniforms, {
    framebuffer: fboParticleIds,
    particles: particlePonger.getCurrent('particles')
  });

  requestAnimationFrame(render);
}

window.onload = function() {
  startTime, currentTime, elapsedTime, lastFrameStart, lastFrameTime = startTiming();
  deltaT = vec4.fromValues(0.0,0.0,0.0,0.0);

  render();
};