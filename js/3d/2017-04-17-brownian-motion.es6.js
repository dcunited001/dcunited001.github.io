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

window.createProgram = function(gl, vertexShaderSource, fragmentShaderSource, defines = {}) {
  var program = gl.createProgram();
  vertexShaderSource = "#version 300 es\n" + expandDefines(defines) + vertexShaderSource;
  fragmentShaderSource = "#version 300 es\n" + expandDefines(defines) + fragmentShaderSource;

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

window.expandDefines = function(defines = {}) {
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

window.loadImage = function(url, onload) {
  var img = new Image();
  img.src = url;
  img.onload = function() {
    onload(img);
  };
  return img;
};

window.loadImages = function(urls, onload) {
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

window.loadObj = function(url, onload) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'text';
  xhr.onload = function(e) {
    var mesh = new OBJ.Mesh(this.response);
    onload(mesh);
  };
  xhr.send();
};

// TODO: refactor some of the code above into classes
// - bc i want to be able to query uniform locations from an obj representing the program
//   - instead of the render pass
//class WebGL2Program {
//  constructor(context) {
//
//  }
//
//  get vertexSource () { return this._vertexSource; }
//  set vertexSource (vertexSource) { this._vertexSource = vertexSource; }
//  get fragmentSource () { return this._fragmentSource; }
//  set fragmentSource (fragmentSource) { this._fragmentSource = fragmentSource; }
//
//  get vertexShader () { return this._vertexShader; }
//  set vertexShader (vertexShader) { this._vertexShader = vertexShader; }
//  get fragmentShader () { return this._fragmentShader; }
//  set fragmentShader (fragmentShader) { this._fragmentShader = fragmentShader; }
//
//  get program () { return this._program; }
//  set program (program) { this._program = program; }
//
//  createProgram () {
//
//  }
//
//}

class Quad {
  constructor(context) {
    this._pos = this.getQuadPositions();
    this._tex = this.getQuadTexCoords();

    this._buffers = this.prepareBuffers(context, this._pos, this._tex);
    this._vertexArray = this.prepareVertexArray(context, this._buffers);
  }

  get pos () { return this._pos; }
  set pos (pos) { this._pos = pos }

  get tex () { return this._tex; }
  set tex (tex) { this._tex = tex; }

  get buffers () { return this._buffer; }
  set buffers (buffer) { this._buffer = buffer; }

  get vertexArray () { return this._vertexArray; }
  set vertexArray (vertexArray) { this._vertexArray = vertexArray; }

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

    var vertextexIdx = 4;
    context.bindBuffer(context.ARRAY_BUFFER, buffers.tex);
    context.vertexAttribPointer(vertextexIdx, 2, context.FLOAT, false, 0,0);
    context.enableVertexAttribArray(vertextexIdx);
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
      1.0,  1.0, 0.0, 1.0,
      1.0,  1.0, 0.0, 1.0,
      -1.0,  1.0, 0.0, 1.0,
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

class ResourceProvider {
  // i need the triple buffering pattern from iOS/OSX Metal semaphore
  // - this is because i'm rendering updated particle positons to a texture
  //   - this in turn renders a gradient that's used in the next frame
  // - double buffering may be enough, but ideally the data should remain written to buffer for as long as it's needed to render

  // TODO: resource registration (do i need this?)
  // - register resources with this object to have their reading/writing resources swapped out
  //

  // resource attacher map (key) => ((fb, texture) => success)
  // - wires together textures for a given framebuffer & color attachment for this frame
  //   - i need to instantiate all the textures up front and repoint them as needed

  getCurrentId() {
    return this._current;
  }

  getNextId() {
    if (this._current == 2) {
      return 0;
    } else {
      return this._current + 1;
    }
  }

  increment() {
    if (this._current == 2) {
      this._current = 0;
    } else {
      this._current++;
    }
  }
}

function triplicateResource(f) {
  // run function 3 times
  return [0,1,2].map(f)
}

function updateTexture(f) {
  //return a function that's enveloped in the correct access calls to update before render or b/w draw calls
  return function(context, triple, i) {
    var thisTexture = triple[i];

    context.activeTexture(context.TEXTURE0);
    context.bindTexture(gl.TEXTURE_2D, triple[i]);

    f(context, thisTexture);

    context.bindTexture(gl.TEXTURE_2D, null);
  }
}

//class TexturePool {
//  constructor () {
//    this._textures = {};
//    this._current = 0;
//  }
//
//  getTexture(key, i) {
//    this._textures[key][i];
//  }
//  setTexture(key, i, texture) {
//    this._textures[key][i] = texture;
//  }
//
//  increment() {
//    this._current++;
//  }
//}

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

canvas.onmousedown = function(event) {
  mouseDown = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
};

canvas.onmouseup = function(event) {
  mouseDown = false;
};

canvas.onmousemove = function(event) {
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

var gl = canvas.getContext( 'webgl2', { antialias: true } );
var isWebGL2 = !!gl;
if(!isWebGL2) {
  document.getElementById('info').innerHTML = 'WebGL 2 is not available.  See <a href="https://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">How to get a WebGL 2 implementation</a>';
  console.error('WebGL 2 is not available.')
}

var WIN_X = gl.drawingBufferWidth;
var WIN_Y = gl.drawingBufferHeight;

var UINT32_MAX = 2 ** 32 - 1;

// =======================================
// GLSL Programs
// =======================================

// -- initialize glsl programs
var shaderVertexPassthrough = document.getElementById('vertexPassthrough').textContent,
  shaderRandoms = document.getElementById('shaderRandoms').textContent,
  shaderVertex = document.getElementById('shaderVertex').textContent,
  shaderFragment = document.getElementById('shaderFragment').textContent,
  shaderTest = document.getElementById('shaderTest').textContent;

var shaderDefines = {};
var programRandomTexture = createProgram(gl, shaderVertexPassthrough, shaderRandoms);
var programParticleGradient = createProgram(gl, shaderVertexPassthrough, shaderTest);
var programFinal = createProgram(gl, shaderVertex, shaderTest);

var programTest = createProgram(gl, shaderVertexPassthrough, shaderTest);

// =======================================
// GLSL options
// =======================================

gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LESS);

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

// =======================================
// particles
// =======================================

// TODO: generate initial texture to use for particle positions
// TODO: generate initial texture to use for randoms

function generateFloat32Randoms(h,w,n) {
  var randoms = new Float32Array(w*h*n);
  for (var i=0; i<(w*h*n); i++) {
    randoms[i] = Math.random();
  }
  return randoms
}

function generateUInt32Randoms(h,w,n) {
  var randoms = new Uint32Array(w*h*n);
  for (var i=0; i<(w*h*n); i++) {
    randoms[i] = Math.trunc(Math.random() * 255);
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

function generateParticleIndices(h,w) {
  var indices = new Uint32Array(h*w);
  for (var i=0; i<(h*w); i++){
    indices[i] = i;
  }
  return indices;
}

var particleIdx = generateParticleIndices(PARTICLE_FB_HEIGHT, PARTICLE_FB_WIDTH);

var particleIdxBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, particleIdxBuffer);
gl.bufferData(gl.ARRAY_BUFFER, particleIdx, gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var particleVertexArray = gl.createVertexArray();
gl.bindVertexArray(particleVertexArray);

var particleIdxIndex = 0;
gl.bindBuffer(gl.ARRAY_BUFFER, particleIdxBuffer);
gl.vertexAttribPointer(particleIdxIndex, 1, gl.UNSIGNED_INT, false, 0,0);
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

var PARTICLE_FB_HEIGHT = 100;
var PARTICLE_FB_WIDTH = 32;

// four attributes can be stores per texture (x,y,z,w)
var particleRandomsAttachments, // stores random seed data (unfortunately integers)
  particleBasicsAttachments,   // stores particle basics (floats)
  particleIntsAttachments;     // stores more attributes (ints)

var randomIntData = generateUInt32Randoms(PARTICLE_FB_HEIGHT, PARTICLE_FB_WIDTH, 4);
var randomFloatData = generateFloat32Randoms(PARTICLE_FB_HEIGHT, PARTICLE_FB_WIDTH, 4);

var particleRandomsAttachments = triplicateResource((f) => {
  gl.activeTexture(gl.TEXTURE0);
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);

  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32UI, PARTICLE_FB_WIDTH, PARTICLE_FB_HEIGHT);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return tex;
});

var particleBasicsAttachments = triplicateResource(() => {
  gl.activeTexture(gl.TEXTURE0);
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);

  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, PARTICLE_FB_HEIGHT, PARTICLE_FB_WIDTH);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return tex;
});

var particleIntsAttachments = triplicateResource(() => {
  gl.activeTexture(gl.TEXTURE0);
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);

  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32UI, PARTICLE_FB_WIDTH, PARTICLE_FB_HEIGHT);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return tex;
});

// =======================================
// Particle Framebuffer: Set initial data for color attachments
// =======================================

// initialize random seeds
updateTexture((context, texture) => {

  context.texSubImage2D(gl.TEXTURE_2D,
    0,
    0, // x offset
    0, // y offset
    PARTICLE_FB_HEIGHT,
    PARTICLE_FB_WIDTH,
    gl.RGBA32UI,
    gl.UNSIGNED_INT,
    randomIntData);

})(gl, particleRandomsAttachments, 0);

// init particle positions
updateTexture((context, texture) => {

  context.texSubImage2D(gl.TEXTURE_2D,
    0,
    0, // x offset
    0, // y offset
    PARTICLE_FB_HEIGHT,
    PARTICLE_FB_WIDTH,
    gl.RGBA32F,
    gl.FLOAT,
    randomFloatData);

})(gl, particleBasicsAttachments, 0);

// TODO: initial values for particle integer data
//updateTexture((context, texture) => {
//  gl.texSubImage2D(gl.TEXTURE_2D,
//    0,
//    0, // x offset
//    0, // y offset
//    PARTICLE_FB_HEIGHT,
//    PARTICLE_FB_WIDTH,
//    gl.RGBA32UI,
//    gl.UNSIGNED_INT,
//    null);
//});

// =======================================
// Field Framebuffer: Color Attachments
// =======================================

var fieldAttachments, // stores a shared field based on rendered & current particle positions
  fieldGradientAttachments; // stores data about gradients in the fields

var particleRandomsAttachments = triplicateResource((f) => {
  gl.activeTexture(gl.TEXTURE0);
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texStorage2D(gl.TEXTURE_2D, 1, GL.RGBA32F, WIN_X, WIN_Y);

  // TODO: remove? i just need zeros (IVP isn't a problem...)
  //gl.texSubImage2D(gl.TEXTURE_2D,
  //  0,
  //  0,
  //  0,
  //  WIN_X,
  //  WIN_Y,
  //  gl.RGBA32F,
  //  gl.FLOAT,
  //  null);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
});

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
// FramebufferConfig
// =======================================

class FramebufferConfig {
  constructor (context, framebuffer) {
    this._context = context;
    this._framebuffer = framebuffer;
    this._attachments = {};
  }

  get context() { return this._context; }
  set context(context) { this._context = context; }
  get attachments () { return this._attachments; }
  set attachments (attachments) { this._attachments = attachments; }
  get framebuffer () { return this.framebuffer; }
  set framebuffer (fb) { this._framebuffer = fb; }

  selectFramebuffer() {
    this.context.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this._framebuffer);
  }

  configAttachments() {
    //console.log(this.attachments);
    //console.log(Object.keys(this.attachments));
    for (var k of Object.keys(this.attachments)) {
      var attKey = parseInt(k);
      var att = this.attachments[attKey];
      console.log(attKey,att);
      if (att !== undefined) {
        this.context.framebufferTexture2D(this._context.DRAW_FRAMEBUFFER, k, att.texTarget, att.texture, att.mipmapLevel || 0);
      } else {
        console.error("FramebufferConfig: undefined attachment")
      }
    }
  }

  setDrawBuffers(keys) {
    if (keys !== undefined && keys && !(keys.length == 0)) {
      this.context.drawBuffers(keys);
    }
  }

  checkStatus() {
    var status = this.context.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
    if (status != gl.FRAMEBUFFER_COMPLETE) {
      console.error('FramebufferConfig: status - ' + status.toString(16));
    }
  }

  config() {
    this.selectFramebuffer();
    this.configAttachments();
    this.checkStatus();
    this.cleanupConfig();
  }

  cleanupConfig() {
    this.context.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  }

  encode(attachmentKeys = [], encodeBlock) {
    this.selectFramebuffer();
    this.setDrawBuffers(attachmentKeys);

    if (encodeBlock === undefined) {
      console.error("FramebufferConfig: no encode block");
    } else {
      encodeBlock();
    }

    this.cleanupEncode();
  }

  cleanupEncode() {
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  }
}

// =======================================
// RenderPassConfig
// =======================================

class RenderPassConfig {

  constructor (context, program, options = { uniformLocations: {} }) {
    this._program = program;
    this._context = context;
    this._uniformLocations = options.uniformLocations || {};
    delete options.uniformLocations;
    this._options = options;
  }

  get program () { return this._program }
  set program (program) {
    setUniformLocations();
    this._program = program;
  }

  get context() { return this._context; }
  set context(context) { this._context = context; }
  get options() { return this._options; }
  set options(options) { this._options = options; }
  get uniformLocations() { return this._uniformLocations; }
  set uniformLocations(uniformLocations) { this._uniformLocations = uniformLocations; }

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

  config() {
    //
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
    this._context.useProgram(null)
  }
}

function makeBlitter () {
  // TODO: return a object with functions to glue two framebuffers together
  // - and specifies how they should blit
  // - it represents the transition b/w fb1.attachment to the input of fb2
  // - it configures the READ_FRAMEBUFFER & DRAW_FRAMEBUFFER
}

// =======================================
// configure framebuffers
// =======================================

var particleFramebuffer = new FramebufferConfig(gl, gl.createFramebuffer());
particleFramebuffer.attachments[gl.COLOR_ATTACHMENT0] = {
  texTarget: gl.TEXTURE_2D,
  texture: particleAttachment0
};

var offscreenFramebuffer = new FramebufferConfig(gl, gl.createFramebuffer());

offscreenFramebuffer.attachments[gl.COLOR_ATTACHMENT0] = {
  texTarget: gl.TEXTURE_2D,
  texture: attachment0
};
offscreenFramebuffer.attachments[gl.COLOR_ATTACHMENT1] = {
  texTarget: gl.TEXTURE_2D,
  texture: attachment1
};
offscreenFramebuffer.attachments[gl.COLOR_ATTACHMENT2] = {
  texTarget: gl.TEXTURE_2D,
  texture: attachment2
};

offscreenFramebuffer.config();

var onscreenFramebuffer = new FramebufferConfig(gl, null);
// TODO: set any offscreen color attachments
onscreenFramebuffer.config();

// =======================================
// configure renderpasses
// =======================================

var renderPassRandoms = new RenderPassConfig(gl, programRandomTexture, {
  encodeUniforms: (context, uniforms, options) => {
    //TODO: set uniforms
    // this._context.uniform1i(options., 0);

    //var drawUniformColor1Location = gl.getUniformLocation(drawProgram, 'color1Map');
    //var drawUniformColor2Location = gl.getUniformLocation(drawProgram, 'color2Map');
  },
  encodeDraw: (context, uniforms, options) => {
    // draw quad
    context.bindVertexArray(finalQuad.vertexArray);
    context.drawArrays(context.TRIANGLES, 0, 6);
  }
});

renderPassRandoms.initUniformLocations([
  'resolution',
  'randomStepSeed',
  'resourcePoolId',
  'texRandom'
]);

renderPassRandoms.setUniformLocations();

var renderPassGradient = new RenderPassConfig(gl, programParticleGradient, {
  encodeUniforms: (context, uniforms, options) => {
    //TODO: set uniforms
    //TODO: set texture for vertex positions
  },
  encodeDraw: (context, uniforms, options) => {
    // draw quad
    context.bindVertexArray(finalQuad.vertexArray);
    context.drawArrays(context.TRIANGLES, 0, 6);
  }
});

renderPassGradient.initUniformLocations([
  'resolution',
  'randomStepSeed',
  'resourcePoolId',
  'texRandom'
]);

renderPassGradient.setUniformLocations();

// TODO: change to programRenderFinal
var finalRenderPass = new RenderPassConfig(gl, programTest, {
  beforeEncode: (context, uniforms, options) => {
    context.clearColor(0.0, 0.0, 0.0, 1.0);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
  },
  encodeUniforms: (context, uniforms, options) => {
    //TODO: set uniforms
    //TODO: set texture from gradient pass
  },
  encodeDraw: (context, uniforms, options) => {
    // draw quad
    context.bindVertexArray(finalQuad.vertexArray);
    context.drawArrays(context.TRIANGLES, 0, 6);
  }
});

finalRenderPass.initUniformLocations([
  'resolution',
  'resourcePoolId'
]);

finalRenderPass.setUniformLocations();

var resourcePoolId = 0;

function updateResourcePoolId() {
  if (resourcePoolId == 2) {
    resourcePoolId = 0
  } else {
    resourcePoolId++;
  }
}

//renderPassRandoms.config();
//renderPassGradient.config();
finalRenderPass.config();
render();

function getRandomStepSeed() {
  return [
    Math.trunc(Math.random() * UINT32_MAX),
    Math.trunc(Math.random() * UINT32_MAX),
    Math.trunc(Math.random() * UINT32_MAX),
    Math.trunc(Math.random() * UINT32_MAX)
  ];
}

var drawToAttachments;

function render() {

  // TODO: decide which framebuffers need a clear?
  drawToAttachments = [
    gl.NONE,
    gl.COLOR_ATTACHMENT1
  ];

  // -- pass 1: render randoms
  var randomUniforms = {
    resolution: vec2.create(WIN_X, WIN_Y),
    randomStepSeed: getRandomStepSeed(),
    resourcePoolId: resourcePoolId,
    texRandom: renderPassRandoms.uniformLocations['texRandom']
  };

  drawToAttachments = [
    gl.NONE,
    gl.COLOR_ATTACHMENT1,
    gl.NONE
  ];

  //console.log(randomUniforms);
  offscreenFramebuffer.encode(drawToAttachments, () => renderPassRandoms.encode(randomUniforms));
  offscreenFramebuffer.cleanupEncode();

  // -- Pass 2: render gradient from particle location
  // -  (and new particle locations in vertex shader?)
  // TODO: set uniforms and options
  //offscreenFramebuffer.encode([gl.COLOR_ATTACHMENT0], () => renderPassGradient.encode(uniforms, options));
  //offscreenFramebuffer.cleanupEncode();

  // -- Final Pass: render image
  onscreenFramebuffer.encode(null, () => finalRenderPass.encode({}));
  offscreenFramebuffer.cleanupEncode();

  //orientation[0] = 0.00020; // yaw
  //orientation[1] = 0.00010; // pitch
  //orientation[2] = 0.00005; // roll

  //mat4.rotateX(mvMatrix, mvMatrix, orientation[0] * Math.PI);
  //mat4.rotateY(mvMatrix, mvMatrix, orientation[1] * Math.PI);
  //mat4.rotateZ(mvMatrix, mvMatrix, orientation[2] * Math.PI);

  updateResourcePoolId();
  requestAnimationFrame(render);
}

function cleanup() {

}