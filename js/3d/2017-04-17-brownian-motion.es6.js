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
  // if empty, return empty string
  // otherwise iterate through and generate string to prepend

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

// =======================================
// RenderPassConfig
// =======================================

class RenderPassConfig {

  constructor(context, program, options = {uniformLocations: {}}) {
    this._program = program;
    this._context = context;
    this._uniformLocations = options.uniformLocations || {};
    delete options.uniformLocations;
    this._options = options;
  }

  get program() {
    return this._program
  }

  set program(program) {
    this._program = program;
  }

  get context() {
    return this._context;
  }

  set context(context) {
    this._context = context;
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

  initUniformLocations(keys) {
    // initialize the keys for uniform locations
    var locations = {};
    for (var k of keys) {
      locations[k] = null;
    }
    this._uniformLocations = locations;
  }

  setUniformLocations() {
    var keys = Object.keys(this.uniformLocations);
    for (var k of keys) {
      this.uniformLocations[k] = this.context.getUniformLocation(this.program, k);
    }
  }

  selectProgram() {
    this.context.useProgram(this.program)
  }

  encode(uniforms, options = {}) {
    var ops = Object.assign({}, this.options, options);

    // for each key in uniforms, encode value into the specific location
    if (ops.beforeEncode !== undefined) {
      ops.beforeEncode(this.context, uniforms, ops);
    }

    this.selectProgram();

    if (ops.encodeUniforms !== undefined) {
      ops.encodeUniforms(this.context, uniforms, ops);
    } else {
      this.encodeUniforms(this.context, uniforms, ops);
    }

    if (ops.encodeDraw !== undefined) {
      ops.encodeDraw(this.context, uniforms, ops);
    } else {
      this.encodeDraw(this.context, uniforms, ops);
    }

    if (ops.afterEncode !== undefined) {
      ops.afterEncode(this.context, uniforms, ops);
    }

    this.cleanupEncode();
  }

  encodeUniforms(c, uniforms, options = {}) {
    console.error("RenderPassConfig: override encodeUniforms() or pass 'encodeUniforms'")
  }

  encodeDraw(c, uniforms, options = {}) {
    console.error("RenderPassConfig: override encodeDraw() or pass 'encodeDraw'")
  }

  cleanupEncode() {
    this._context.bindBuffer(this._context.ARRAY_BUFFER, null);
    this._context.bindVertexArray(null);
    this._context.useProgram(null);
  }
}

class ResourceProvider {
  // i need the triple buffering pattern from iOS/OSX Metal semaphore
  // - this is because i'm rendering updated particle positons to a texture
  //   - this in turn renders a gradient that's used in the next frame
  // - double buffering may be enough, but ideally the data should remain written to buffer for as long as it's needed to render

  constructor(options = {}) {
    this._current = 0;
    this._textures = {};
    this._max = options.max || 3
  }

  registerTextures(k, textures) {
    this._textures[k] = textures;
  }

  getCurrent(k) {
    return this._textures[k][this.getCurrentId()];
  }

  getNext(k) {
    return this._textures[k][this.getNextId()];
  }

  getPrev(k) {
    return this._textures[k][this.getPrevId()];
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

//class TexturePonger {
//  constructor(options = {}) {
//    this._current = 0;
//    this._max = options.max || 2;
//    this._textures = {};
//    this._framebuffers = {};
//  }
//
//  registerTexture(k, textures) {
//    // TODO: allow monad to be registered
//    // - dynamically providing texture from another texturePonger
//    this._textures[k] = textures;
//  }
//}

function triplicateResource(f) {
  // run function 3 times
  return [0, 1, 2].map(f)
}

function updateTexture(f) {
  //return a function that's enveloped in the correct access calls to update before render or b/w draw calls
  return function (context, triple, i) {
    var thisTexture = triple[i];

    context.activeTexture(context.TEXTURE0);
    context.bindTexture(context.TEXTURE_2D, triple[i]);

    f(context, thisTexture);

    context.bindTexture(context.TEXTURE_2D, null);
  }
}

function runWebGL() {

  var canvas = document.getElementById('main-canvas');
  canvas.style.width = '100%';
  canvas.height = 500;
  canvas.width = canvas.offsetWidth;

  // =======================================
  // UI events
  // =======================================

  var mouseDown = false;
  var lastMouseX = 0;
  var lastMouseY = 0;

  canvas.onmousedown = function (event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  };

  canvas.onmouseup = function (event) {
    mouseDown = false;
  };

  canvas.onmousemove = function (event) {
    var newX = event.clientX;
    var newY = event.clientY;
    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;
    var m = mat4.create();
    mat4.rotateX(m, m, deltaX / 100.0);
    mat4.rotateY(m, m, deltaY / 100.0);
    mat4.multiply(tempMat4, mvMatrix, m);
    mat4.copy(mvMatrix, tempMat4);
    lastMouseX = newX;
    lastMouseY = newY;
  };

  // =======================================
  // Canvas & WebGL
  // =======================================

  var gl = canvas.getContext('webgl2', {antialias: true});
  var colorBufferFloatExt = gl.getExtension('EXT_color_buffer_float');
  if (!colorBufferFloatExt) {
    console.error("EXT_color_buffer_float not supported.")
  }

  console.log(gl.FRAMEBUFFER_COMPLETE, 'FRAMEBUFFER_COMPLETE');
  console.log(gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT, 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT');
  console.log(gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT, 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT');
  console.log(gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS, 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS');

  var isWebGL2 = !!gl;
  if (!isWebGL2) {
    document.getElementById('info').innerHTML = 'WebGL 2 is not available.  See <a href="https://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">How to get a WebGL 2 implementation</a>';
    console.error('WebGL 2 is not available.')
  }

  var WIN_X = gl.drawingBufferWidth;
  var WIN_Y = gl.drawingBufferHeight;

  var UINT32_MAX = (2 ** 32) - 1;
  var INT32_MAX = (2 ** 31) - 1;

  // =======================================
  // GLSL Programs
  // =======================================

  // -- initialize glsl programs
  var vsPass = document.getElementById('vsPass').textContent,
    fsParticleRandoms = document.getElementById('fsParticleRandoms').textContent,
    fsParticleIntRandoms = document.getElementById('fsParticleIntRandoms').textContent,
    fsParticleUpdate = document.getElementById('fsParticleUpdate').textContent,
    vsFieldPoints = document.getElementById('vsFieldPoints').textContent,
    fsFieldPoints = document.getElementById('fsFieldPoints').textContent,
    //vsField = document.getElementById('vsField').textContent,
    fsField = document.getElementById('fsField').textContent,
    fsTest = document.getElementById('fsTest').textContent,
    fsTestRandoms = document.getElementById('fsTestRandoms').textContent,
    fsTestFieldPoints = document.getElementById('fsTestFieldPoints').textContent;

  var shaderDefines = {};
  var programRandomTexture = createProgram(gl, vsPass, fsParticleRandoms);
  var programIntRandomTexture = createProgram(gl, vsPass, fsParticleIntRandoms);
  //var programParticleGradient = createProgram(gl, vsPass, shaderTest);
  var programParticleUpdate = createProgram(gl, vsPass, fsParticleUpdate);
  //var programFieldPoints = createProgram(gl, vsPass, fsTestRandoms);
  var programFieldPoints = createProgram(gl, vsFieldPoints, fsFieldPoints);
  var programField = createProgram(gl, vsPass, fsField);
  // TODO: programFieldGradient (may need another size of texture)
  var programFinal = createProgram(gl, vsPass, fsTest);
  var programTest = createProgram(gl, vsPass, fsTestFieldPoints);

  // =======================================
  // GLSL options
  // =======================================

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // =======================================
  // particles
  // =======================================

  // TODO: generate initial texture to use for particle positions
  // TODO: generate initial texture to use for randoms

  function generateFloat32Randoms(w, h, n, max = 1, min = 0) {
    var randoms = new Float32Array(w * h * n);
    var range = max - min;
    var mid = min + range/2;
    for (var i = 0; i < (w * h * n); i++) {
      randoms[i] = Math.random() * range + min;
    }
    return randoms
  }

  function generateUInt32Randoms(w, h, n) {
    // TODO: generate with min/max
    var randoms = new Uint32Array(w * h * n);
    for (var i = 0; i < (w * h * n); i++) {
      randoms[i] = Math.trunc(Math.random() * UINT32_MAX);
    }
    return randoms
  }

  function generateInt32Randoms(w, h, n) {
    // TODO: generate with min/max
    var randoms = new Int32Array(w * h * n);
    for (var i = 0; i < (w * h * n); i++) {
      randoms[i] = Math.trunc(Math.random() * UINT32_MAX - INT32_MAX);
    }
    return randoms
  }

  // attributes
  // particle_index
  // particle_x
  // particle_y
  // particle_frequency
  // particle_amplitude
  // particle_radian

  // =======================================
  // particle buffers
  // =======================================

  function generateParticleIndices(h, w) {
    var indices = new Int32Array(h * w);
    for (var i = 0; i < (h * w); i++) {
      indices[i] = i;
    }
    return indices;
  }

  var PARTICLE_FB_HEIGHT = 100;
  var PARTICLE_FB_WIDTH = 32;
  var PARTICLE_COUNT = PARTICLE_FB_HEIGHT * PARTICLE_FB_WIDTH;

  var particleIdx = generateParticleIndices(PARTICLE_FB_HEIGHT, PARTICLE_FB_WIDTH);

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

  // =======================================
  // final quad geometry
  // =======================================

  var finalQuad = new Quad(gl);

  // =======================================
  // Particle Framebuffer: Create Color Attachments
  // =======================================

  // four attributes can be stores per texture (x,y,z,w)
  var particleRandomsAttachments, // stores random seed data
    particleIntRandomsAttachments, // stores random seed data (as integers)
    particleBasicsAttachments,   // stores particle basics (floats)
    particleIntsAttachments;     // stores more attributes (ints)

  //var randomIntData = generateUInt32Randoms(PARTICLE_FB_WIDTH, PARTICLE_FB_HEIGHT, 4);
  var randomFloatData = generateFloat32Randoms(PARTICLE_FB_WIDTH, PARTICLE_FB_HEIGHT, 4, -1.0, 1.0);

  particleRandomsAttachments = triplicateResource((f) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, PARTICLE_FB_WIDTH, PARTICLE_FB_HEIGHT);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return tex;
  });

  particleIntRandomsAttachments = triplicateResource((f) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32I, PARTICLE_FB_WIDTH, PARTICLE_FB_HEIGHT);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return tex;
  });

  particleBasicsAttachments = triplicateResource(() => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, PARTICLE_FB_WIDTH, PARTICLE_FB_HEIGHT);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return tex;
  });

  // =======================================
  // Field Framebuffer: Color Attachments
  // =======================================

  var fieldPointsAttachments, // stores the id's of rendered points (up to one point per pixel, ...)
    repelFieldAttachments, // stores a shared field based on rendered & current particle positions
    attractFieldAttachments,
    fieldGradientAttachments; // stores data about gradients in the fields

  fieldPointsAttachments = triplicateResource((f) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, WIN_X, WIN_Y);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return tex;
  });

  repelFieldAttachments = triplicateResource((f) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, WIN_X, WIN_Y);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return tex;
  });

  attractFieldAttachments = triplicateResource((f) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, WIN_X, WIN_Y);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return tex;
  });

  fieldGradientAttachments = triplicateResource((f) => {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, WIN_X, WIN_Y);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return tex;
  });

  // =======================================
  // Initialize texture data
  // =======================================

  for (var i = 0; i <= 2; i++) {

    // initialize random seeds
    updateTexture((context, texture) => {

      context.texSubImage2D(context.TEXTURE_2D,
        0,
        0, // x offset
        0, // y offset
        PARTICLE_FB_WIDTH,
        PARTICLE_FB_HEIGHT,
        context.RGBA,
        context.FLOAT,
        generateFloat32Randoms(PARTICLE_FB_WIDTH, PARTICLE_FB_HEIGHT, 4));

    })(gl, particleRandomsAttachments, i);

    // initialize random seeds
    updateTexture((context, texture) => {

      context.texSubImage2D(context.TEXTURE_2D,
        0,
        0, // x offset
        0, // y offset
        PARTICLE_FB_WIDTH,
        PARTICLE_FB_HEIGHT,
        context.RGBA_INTEGER,
        context.INT,
        generateInt32Randoms(PARTICLE_FB_WIDTH, PARTICLE_FB_HEIGHT, 4));

    })(gl, particleIntRandomsAttachments, i);

    // init particle positions
    updateTexture((context, texture) => {

      context.texSubImage2D(context.TEXTURE_2D,
        0,
        0, // x offset
        0, // y offset
        PARTICLE_FB_WIDTH,
        PARTICLE_FB_HEIGHT,
        context.RGBA,
        context.FLOAT,
        randomFloatData);

    })(gl, particleBasicsAttachments, i);

  }

  // =======================================
  // Initialize render variables
  // =======================================
  var orientation = [0.0, 0.0, 0.0];
  var tempMat4 = mat4.create();
  var modelMatrix = mat4.create();

  var eyeVec3 = vec3.create();
  vec3.set(eyeVec3, 4, 3, 1);
  var centerVec3 = vec3.create();
  vec3.set(centerVec3, 0, 0.5, 0);
  var upVec3 = vec3.create();
  vec3.set(upVec3, 0, 1, 0);

  var viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, eyeVec3, centerVec3, upVec3);
  var mvMatrix = mat4.create();
  mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
  var perspectiveMatrix = mat4.create();
  mat4.perspective(perspectiveMatrix, 0.785, 1, 1, 1000);

  // =======================================
  // configure framebuffers
  // =======================================

  var randomFb = [0,1,2].map((i) => {
    var fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fb);
    //gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, particleRandomsAttachments[i], 0);
    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, particleIntRandomsAttachments[i], 0);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    return fb;
  });

  var particleFb = gl.createFramebuffer();
  var fieldFb = gl.createFramebuffer();

  // =======================================
  // configure renderpasses
  // =======================================

  var anyQuad = new Quad(gl);

  var renderPassRandoms = new RenderPassConfig(gl, programIntRandomTexture, {
    beforeEncode: (context, uniforms, options) => {
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, options.framebuffer);
      context.viewport(0,0,uniforms.resolution[0], uniforms.resolution[1]);
      context.clearColor(0, 0, 0, 0);
      context.clear(context.COLOR_BUFFER_BIT);
    },
    encodeUniforms: (context, uniforms, options) => {
      context.uniform2fv(renderPassRandoms.uniformLocations.resolution, uniforms.resolution);
      //context.uniform4fv(renderPassRandoms.uniformLocations.randomSeed, uniforms.randomSeed);
      context.uniform4iv(renderPassRandoms.uniformLocations.randomSeed, uniforms.randomSeed);
      // context.uniform2fv(renderPassRandoms.uniformLocations.randomRange, uniforms.randomRange);
      context.uniform1i(renderPassRandoms.uniformLocations.particleRandoms, uniforms.particleRandomsLocation);

      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, options.particleRandoms);
    },
    encodeDraw: (context, uniforms, options) => {
      context.drawBuffers([
        context.COLOR_ATTACHMENT0
      ]);

      checkFbStatus();

      context.bindVertexArray(anyQuad.vertexArray);
      context.drawArrays(context.TRIANGLES, 0, 6);
    },
    afterEncode: (context, uniforms, options) => {
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, null);
    }
  });

  renderPassRandoms.initUniformLocations([
    'resolution',
    'randomSeed',
    'randomRange',
    'particleRandoms'
  ]);

  renderPassRandoms.setUniformLocations();

  var renderPassParticles = new RenderPassConfig(gl, programParticleUpdate, {
    framebuffer: particleFb,
    beforeEncode: (context, uniforms, options) => {
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, options.framebuffer);
      context.viewport(0,0,uniforms.resolution[0], uniforms.resolution[1]);
      context.clearColor(0.0, 0.0, 0.0, 1.0);
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
    },
    encodeUniforms: function (context, uniforms, options) {
      context.uniform2fv(renderPassParticles.uniformLocations.resolution, uniforms.resolution);
      context.uniform1i(renderPassParticles.uniformLocations.particleRandoms, uniforms.particleRandomsLocation);
      context.uniform1i(renderPassParticles.uniformLocations.particleBasics, uniforms.particleBasicsLocation);

      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, options.particleRandoms);

      context.activeTexture(context.TEXTURE1);
      context.bindTexture(context.TEXTURE_2D, options.particleBasics);
    },
    encodeDraw: function (context, uniforms, options) {
      context.framebufferTexture2D(context.DRAW_FRAMEBUFFER, context.COLOR_ATTACHMENT0, context.TEXTURE_2D, options.particleBasicsNext, 0);

      context.drawBuffers([
        context.COLOR_ATTACHMENT0
      ]);

      checkFbStatus();

      context.bindVertexArray(anyQuad.vertexArray);
      context.drawArrays(context.TRIANGLES, 0, 6);
    },
    afterEncode: (context, uniforms, options) => {
      context.bindFramebuffer(context.DRAW_FRAMEBUFFER, null);
    }
  });

  renderPassParticles.initUniformLocations([
    'resolution',
    'deltaTime',
    'particleRandoms',
    'particleBasics'
  ]);

  renderPassParticles.setUniformLocations();

  var rpFieldPoints = new RenderPassConfig(gl, programFieldPoints, {
    beforeEncode: (context, uniforms, options) => {
      context.clearColor(0.0, 0.0, 0.0, 1.0);
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
    },
    encodeUniforms: (context, uniforms, options) => {
      context.uniform1i(rpFieldPoints.uniformLocations.particleBasics, uniforms.particleBasicsLocation);
      context.uniform2fv(rpFieldPoints.uniformLocations.resolution, uniforms.resolution);

      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, options.particleBasics);
    },
    encodeDraw: (context, uniforms, options) => {
      context.bindVertexArray(particleVertexArray);
      context.drawArrays(context.POINTS, 0, PARTICLE_COUNT);
    }
  });

  rpFieldPoints.initUniformLocations([
    'resolution',
    'particleBasics'
  ]);

  rpFieldPoints.setUniformLocations();

  var rpField = new RenderPassConfig(gl, programField, {
    beforeEncode: (context, uniforms, options) => {
      context.clearColor(0.0, 0.0, 0.0, 1.0);
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
    },
    encodeUniforms: (context, uniforms, options) => {
      context.uniform1i(rpFieldPoints.uniformLocations.particleBasics, uniforms.particleBasicsLocation);
      context.uniform1i(rpFieldPoints.uniformLocations.fieldPoints, uniforms.fieldPointsLocation);
      context.uniform2fv(rpFieldPoints.uniformLocations.resolution, uniforms.resolution);
      context.uniform1i(rpFieldPoints.uniformLocations.ballSize, uniforms.ballSize);
      context.uniform1f(rpFieldPoints.uniformLocations.repelMag, uniforms.repelMag);
      context.uniform1f(rpFieldPoints.uniformLocations.attractMag, uniforms.attractMag);

      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, options.particleBasics);

      context.activeTexture(context.TEXTURE1);
      context.bindTexture(context.TEXTURE_2D, options.fieldPoints);
    },
    encodeDraw: (context, uniforms, options) => {
      context.bindVertexArray(anyQuad.vertexArray);
      context.drawArrays(context.TRIANGLES, 0, 6);
    }
  });

  rpField.initUniformLocations([
    'resolution',
    'ballSize',
    'repelMag',
    'attractMag',
    'particleBasics',
    'fieldPoints'
  ]);

  rpField.setUniformLocations();

  // TODO: change to programRenderFinal
  var finalRenderPass = new RenderPassConfig(gl, programFinal, {
    beforeEncode: (context, uniforms, options) => {
      context.clearColor(0.0, 0.0, 0.0, 1.0);
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
    },
    encodeUniforms: (context, uniforms, options) => {
      context.uniform2fv(finalRenderPass.uniformLocations.resolution, uniforms.resolution);
      context.uniform1i(finalRenderPass.uniformLocations.fieldPoints, uniforms.fieldPointsLocation);
      context.uniform1i(finalRenderPass.uniformLocations.repelField, uniforms.repelFieldLocation);
      context.uniform1i(finalRenderPass.uniformLocations.attractField, uniforms.attractFieldLocation);

      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, options['fieldPoints']);

      context.activeTexture(context.TEXTURE1);
      context.bindTexture(context.TEXTURE_2D, options['repelField']);

      context.activeTexture(context.TEXTURE2);
      context.bindTexture(context.TEXTURE_2D, options['attractField']);
    },
    encodeDraw: (context, uniforms, options) => {
      context.bindVertexArray(anyQuad.vertexArray);
      context.drawArrays(context.TRIANGLES, 0, 6);
    }
  });

  finalRenderPass.initUniformLocations([
    'fieldPoints',
    'repelField',
    'attractField'
  ]);

  finalRenderPass.setUniformLocations();

  var rpTest = new RenderPassConfig(gl, programTest, {
    beforeEncode: (context, uniforms, options) => {
      context.clearColor(0.0, 0.0, 0.0, 1.0);
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
    },
    encodeUniforms: (context, uniforms, options) => {
      context.uniform2fv(rpTest.resolution, uniforms.resolution);
      context.uniform1i(rpTest.fieldPoints, uniforms.fieldPointsLocation);

      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, options['fieldPoints']);
    },
    encodeDraw: (context, uniforms, options) => {
      context.bindVertexArray(anyQuad.vertexArray);
      context.drawArrays(context.TRIANGLES, 0, 6);
    }
  });

  rpTest.initUniformLocations([
    'fieldPoints'
  ]);

  rpTest.setUniformLocations();

  function makeRandomUniforms() {
    return new Float32Array([
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random()
    ]);
  }

  function makeIntRandomUniforms() {
    return new Int32Array([
      Math.trunc(Math.random() * UINT32_MAX - INT32_MAX),
      Math.trunc(Math.random() * UINT32_MAX - INT32_MAX),
      Math.trunc(Math.random() * UINT32_MAX - INT32_MAX),
      Math.trunc(Math.random() * UINT32_MAX - INT32_MAX)
    ]);
  }

  var startTime = Date.now(),
    currentTime = startTime,
    elapsedTime = currentTime - startTime,
    lastFrameStart = currentTime,
    lastFrameTime = currentTime - lastFrameStart;

  // deltaT stores the last four frame times
  var deltaT = vec4.fromValues(0.0, 0.0, 0.0, 0.0);
  var framecount = 0;

  var frameMax;
  //frameMax = 4;

  function updateTime() {
    lastFrameStart = currentTime;
    currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    lastFrameTime = currentTime - lastFrameStart;
  }

  function updateDeltaT(dt, newDeltaT) {
    return vec4.fromValues(newDeltaT, dt[0], dt[1], dt[2]);
  }

  var rp = new ResourceProvider(),
    randomsRp = new ResourceProvider();

  randomsRp.registerTextures('particleRandoms', particleRandomsAttachments);
  randomsRp.registerTextures('particleIntRandoms', particleIntRandomsAttachments);
  rp.registerTextures('particleBasics', particleBasicsAttachments);

  rp.registerTextures('repelField', repelFieldAttachments);
  rp.registerTextures('attractField', attractFieldAttachments);
  rp.registerTextures('fieldPoints', fieldPointsAttachments);
  rp.registerTextures('fieldGradient', fieldGradientAttachments);

  function checkFbStatus() {
    var status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
    if (status != gl.FRAMEBUFFER_COMPLETE) {
      console.error('fb status: ' + status.toString(10));
    }
  }

  var particleResolution = vec2.fromValues(PARTICLE_FB_WIDTH, PARTICLE_FB_HEIGHT);
  var renderResolution = vec2.fromValues(WIN_X, WIN_Y);

  function render() {
    updateTime();
    deltaT = updateDeltaT(deltaT, lastFrameTime);

    // =======================================
    // particle frame buffer
    // =======================================

    // -- pass 1: render new randoms

    var randomUniforms = {
      resolution: particleResolution,
      //randomSeed: makeRandomUniforms(),
      randomSeed: makeIntRandomUniforms(),
      particleRandomsLocation: 0 // TEXTURE0
    };

    renderPassRandoms.encode(randomUniforms, {
      framebuffer: randomFb[randomsRp.getNextId()],
      particleRandoms: randomsRp.getCurrent('particleIntRandoms'),
      //particleRandomsNext: randomsRp.getNext('particleRandoms')
    });

    randomsRp.increment();

    // -- pass 2: render update particle positions

    //var updateParticleUniforms = {
    //  resolution: particleResolution,
    //  deltaTime: deltaT,
    //  particleRandomsLocation: 0,
    //  particleBasicsLocation: 1
    //};

    //renderPassParticles.encode(updateParticleUniforms, {
    //  particleRandoms: randomsRp.getCurrent('particleRandoms'),
    //  particleBasics: rp.getCurrent('particleBasics'),
    //  particleBasicsNext: rp.getNext('particleBasics')
    //});

    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.viewport(0,0, renderResolution[0], renderResolution[1]);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //// =======================================
    //// field frame buffer
    //// =======================================

    //gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fieldFb);
    //gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rp.getNext('fieldPoints'), 0);
    //gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, rp.getNext('repelField'), 0);
    //gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, rp.getNext('attractField'), 0);

    // checkFbStatus();

    //// -- pass 3: render points of particles onto textures

    var rpFieldPointsUniforms = {
      resolution: renderResolution,
      particleBasicsLocation: 0
    };

    //gl.drawBuffers([
    //  gl.COLOR_ATTACHMENT0,
    //  gl.NONE,
    //  gl.NONE
    //]);

    rpFieldPoints.encode(rpFieldPointsUniforms, {
      particleBasics: randomsRp.getCurrent('particleIntRandoms')
      //particleBasics: rp.getNext('particleBasics')
      //particleBasics: rp.getNext('particleBasics')
    });

    rp.increment();

    //// -- pass 4: render the field,
    //// - for each point on the texture, aggregate contributions from surrounding pixels
    //
    //var rpFieldUniforms = {
    //  resolution: renderResolution,
    //  particleBasicsLocation: 0,
    //  fieldPointsLocation: 1,
    //  ballSize: 20,
    //  repelMag: 100,
    //  attractMag: 100
    //};
    //
    //gl.drawBuffers([
    //  gl.NONE,
    //  gl.COLOR_ATTACHMENT1,
    //  gl.COLOR_ATTACHMENT2
    //]);
    //
    //rpField.encode(rpFieldUniforms, {
    //  particleBasics: rp.getNext('particleBasics'),
    //  fieldPoints: rp.getNext('fieldPoints')
    //});
    //
    //// -- pass 5: calculate gradients across field (may require another texture size & framebuffer)
    //
    //gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    //gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    //
    ////var finalUniforms = {
    ////  resolution: renderResolution,
    ////  fieldPointsLocation: 0,
    ////  repelFieldLocation: 1,
    ////  attractFieldLocation: 2
    ////};
    ////
    ////finalRenderPass.encode(finalUniforms, {
    ////  fieldPoints: rp.getNext('fieldPoints'),
    ////  repelField: rp.getNext('repelField'),
    ////  attractField: rp.getNext('attractField')
    ////});
    //
    //var testUniforms = {
    //  resolution: renderResolution,
    //  fieldPointsLocation: 0
    //};
    //
    //rpTest.encode(testUniforms, {
    //  fieldPoints: rp.getNext('fieldPoints')
    //});

    framecount++;

    //if (frameMax !== undefined && framecount < frameMax) {
    requestAnimationFrame(render);
    //setTimeout(function() { requestAnimationFrame(render); }, 250);
    //}
  }

  function cleanup() {

  }

  render();
}

window.onload = function() {
  runWebGL();
};

//window.addEventListener('gliready', runWebGL);
