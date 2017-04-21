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

  var defineStrings = "";
  for (var k in defines.keys) {
    defineStrings += `#define ${k} ${defines[k]}\n`;
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

var PARTICLE_TEXTURE_HEIGHT = 100;
var PARTICLE_TEXTURE_WIDTH = 4;
var PARTICLE_ATTR_SIZE = 4;

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

// var particleIndices = new

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

// buffer structure:
// - particle index
// - particle X
// - particle Y

function generateParticleIndices(h,w) {
  var indices = new Uint32Array(h*w);
  for (var i=0; i<(h*w); i++){
    indices[i] = i;
  }
  return indices;
}

var particlePos = generateFloat32Randoms(PARTICLE_TEXTURE_HEIGHT, PARTICLE_TEXTURE_WIDTH, 2);
var particleIdx = generateParticleIndices(PARTICLE_TEXTURE_HEIGHT, PARTICLE_TEXTURE_WIDTH);

var particlePosBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, particlePosBuffer);
gl.bufferData(gl.ARRAY_BUFFER, particlePos, gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var particleIdxBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, particleIdxBuffer);
gl.bufferData(gl.ARRAY_BUFFER, particleIdx, gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// =======================================
// particle vertex layout
// =======================================

var particleVertexArray = gl.createVertexArray();
gl.bindVertexArray(particleVertexArray);

var particleVertexPosIndex = 0;
gl.bindBuffer(gl.ARRAY_BUFFER, particlePosBuffer);
gl.vertexAttribPointer(particleVertexPosIndex, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(particleVertexPosIndex);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var particleIdxIndex = 2;
gl.bindBuffer(gl.ARRAY_BUFFER, particleIdxBuffer);
gl.vertexAttribPointer(particleIdxIndex, 1, gl.UNSIGNED_INT, false, 0,0);
gl.enableVertexAttribArray(particleVertexPosIndex);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

gl.bindVertexArray(null);

// =======================================
// final quad geometry
// =======================================

var finalQuad = new Quad(gl);

// =======================================
// color attachments for render pipeline
// =======================================

var attachment0, // stores field and gradient to modify vertex behavior
  attachment1, // stores randoms for brownian motion
  attachment2; // stores core vertex data

gl.activeTexture(gl.TEXTURE0);
attachment0 = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, attachment0);

// Initialize a texture twice the window width,
// - so i can alternatively use difference slices of the texture
// - (eventually set to 3x to avoid writing on regions of the texture used to render?)
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, WIN_X * 2, WIN_Y);
//(target, level, xoffset, yoffset, width, height, format, type, ImageData source);
gl.texSubImage2D(gl.TEXTURE_2D,
  0,
  0,
  0,
  WIN_X,
  WIN_Y,
  gl.RGBA32F,
  gl.FLOAT,
  new Float32Array(WIN_X * WIN_Y * 4));

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

gl.activeTexture(gl.TEXTURE1);
attachment1 = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, attachment1);

var attach1data = generateUInt32Randoms(PARTICLE_TEXTURE_HEIGHT, PARTICLE_TEXTURE_WIDTH, 4);

// Initialize a texture twice the window width,
// - so i can alternatively use difference slices of the texture
// - (eventually set to 3x to avoid writing on regions of the texture used to render?)
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32UI, PARTICLE_TEXTURE_WIDTH * PARTICLE_ATTR_SIZE * 2, PARTICLE_TEXTURE_HEIGHT);
//void gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, ImageData source);
gl.texSubImage2D(gl.TEXTURE_2D,
  0,
  0, // x offset
  0, // y offset
  PARTICLE_TEXTURE_HEIGHT,
  PARTICLE_TEXTURE_WIDTH, // TODO: reuse same texture between frames
  gl.RGBA32UI,
  gl.UNSIGNED_INT,
  attach1data);

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

// -- Initialize render variables
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
    for (var i in this._attachments.keys) {
      var att = attachments()[i];
      if (att !== undefined) {
        this.context.framebufferTexture2D(this._context.DRAW_FRAMEBUFFER, i, att.texTarget, att.texture, att.mipmapLevel || 0);
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

  setUniformLocations() {
    // TODO: store uniform locations
  }

  selectProgram() {
    this.context.useProgram(this.program)
  }

  config() {
    // set uniform locations, etc
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

var offscreenFramebuffer = new FramebufferConfig(gl, gl.createFramebuffer());
var onscreenFramebuffer = new FramebufferConfig(gl, null);

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

//renderPassRandoms.config();
//renderPassGradient.config();
finalRenderPass.config();

render();

function render() {
  // TODO: decide which framebuffers need a clear?
  //gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // -- pass 1: render randoms
  //offscreenFramebuffer.encode(attachmentKeys, () => renderPassRandoms.encode(uniforms, options));
  //offscreenFramebuffer.cleanupEncode();

  // -- Pass 2: render gradient from particle location
  // -  (and new particle locations in vertex shader?)
  // TODO: set uniforms and options
  offscreenFramebuffer.encode([gl.COLOR_ATTACHMENT0], () => renderPassGradient.encode(uniforms, options));
  offscreenFramebuffer.cleanupEncode();

  // -- Final Pass: render image
  onscreenFramebuffer.encode(null, () => finalRenderPass.encode({}));
  offscreenFramebuffer.cleanupEncode();

  //orientation[0] = 0.00020; // yaw
  //orientation[1] = 0.00010; // pitch
  //orientation[2] = 0.00005; // roll

  //mat4.rotateX(mvMatrix, mvMatrix, orientation[0] * Math.PI);
  //mat4.rotateY(mvMatrix, mvMatrix, orientation[1] * Math.PI);
  //mat4.rotateZ(mvMatrix, mvMatrix, orientation[2] * Math.PI);

  requestAnimationFrame(render);
}

function cleanup() {

}