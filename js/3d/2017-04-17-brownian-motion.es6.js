'use strict';

//TODO: setup gradient to extend 16 directions outward

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

var windowSize = {
  x: gl.drawingBufferWidth,
  y: gl.drawingBufferHeight
};

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

var PARTICLE_TEXTURE_HEIGHT = 100;
var PARTICLE_TEXTURE_WIDTH = 4;

// TODO: generate initial texture to use for particle positions
// TODO: generate initial texture to use for randoms

function generateRandoms(h,w,n) {
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

// =======================================
// final quad geometry
// =======================================
var quadPositions = new Float32Array([
  -1.0, -1.0, 1.0,
  1.0, -1.0, 1.0,
  1.0,  1.0, 1.0,
  1.0,  1.0, 1.0,
  -1.0,  1.0, 1.0,
  -1.0, -1.0, 1.0
]);

var quadVertexPosBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quadVertexPosBuffer);
gl.bufferData(gl.ARRAY_BUFFER, quadPositions, gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var quadTexcoords = new Float32Array([
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0
]);

var quadVertexTexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quadVertexTexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, quadTexcoords, gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// =======================================
// quad vertex layout
// =======================================
// - reuse as default vertex layout?

var quadVertexArray = gl.createVertexArray();
gl.bindVertexArray(quadVertexArray);

var quadVertexPosIndex = 0;
gl.bindBuffer(gl.ARRAY_BUFFER, quadVertexPosBuffer);
gl.vertexAttribPointer(quadVertexPosIndex, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(quadVertexPosIndex);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var quadVertexTexIndex = 4;
gl.bindBuffer(gl.ARRAY_BUFFER, quadVertexPosBuffer);
gl.vertexAttribPointer(quadVertexTexIndex, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(quadVertexTexIndex);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

gl.bindVertexArray(null);

// =======================================
// color attachments for render pipeline
// =======================================

var attachment0, // stores field and gradient to modify vertex behavior
  attachment1, // stores randoms for brownian motion
  attachment2; // stores core vertex data

gl.activeTexture(gl.TEXTURE0);
attachment0 = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, attachment0);

gl.texImage2D(gl.TEXTURE_2D,
  0,
  gl.RGBA32F,
  windowSize.x,
  windowSize.y,
  0,
  gl.RGBA32F,
  gl.FLOAT,
  new Float32Array(windowSize.x * windowSize.y * 4));

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

gl.activeTexture(gl.TEXTURE1);
attachment1 = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, attachment1);

var attach1data = generateUInt32Randoms(PARTICLE_TEXTURE_HEIGHT, PARTICLE_TEXTURE_WIDTH * 2, 4);

gl.texImage2D(gl.TEXTURE_2D,
  0,
  gl.RGBA32UI,
  PARTICLE_TEXTURE_HEIGHT,
  PARTICLE_TEXTURE_WIDTH * 2, // TODO: reuse same texture between frames
  0,
  gl.RGBA32UI,
  gl.UNSIGNED_INT, // TODO: change to UInt32
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
    if (keys !== undefined && keys && !keys.empty()) {
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
      ops.beforeEncode(uniforms, ops);
    }

    this.selectProgram();

    if (ops.encodeUniforms !== undefined) {
      ops.encodeUniforms(uniforms, ops);
    } else {
      this.encodeUniforms(uniforms, ops);
    }

    if (ops.encodeDraw !== undefined) {
      ops.encodeDraw(uniforms, ops);
    } else {
      this.encodeDraw(uniforms, ops);
    }

    if (ops.afterEncode !== undefined) {
      ops.afterEncode(uniforms, ops);
    }

    this.cleanupEncode();
  }

  encodeUniforms(uniforgms, options = {}) {
    console.error("RenderPassConfig: override encodeUniforms() or pass 'encodeUniforms'")
  }

  encodeDraw(uniforms, options = {}) {
    console.error("RenderPassConfig: override encodeDraw() or pass 'encodeDraw'")
  }

  cleanupEncode() {
    this._context.useProgram(null)
  }
}

var offscreenFramebuffer = new FramebufferConfig(gl, gl.createFramebuffer());
var onscreenFramebuffer = new FramebufferConfig(gl, null);

var renderPassRandoms = new RenderPassConfig(gl, programRandomTexture, {
  encodeUniforms: (uniforms, options) => {
    //TODO: set uniforms
    // this._context.uniform1i(options., 0);

    //var drawUniformColor1Location = gl.getUniformLocation(drawProgram, 'color1Map');
    //var drawUniformColor2Location = gl.getUniformLocation(drawProgram, 'color2Map');
  },
  encodeDraw: (uniforms, options) => {
    // draw quad
    gl.bindVertexArray(quadVertexArray);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
});

var renderPassGradient = new RenderPassConfig(gl, programParticleGradient, {
  encodeUniforms: (uniforms, options) => {
    //TODO: set uniforms
    //TODO: set texture for vertex positions
  },
  encodeDraw: (uniforms, options) => {
    // draw quad
    gl.bindVertexArray(quadVertexArray);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
});

// TODO: change to programRenderFinal
var finalRenderPass = new RenderPassConfig(gl, programTest, {
  beforeEncode: (uniforms, options) => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  },
  encodeUniforms: (uniforms, options) => {
    //TODO: set uniforms
    //TODO: set texture from gradient pass
  },
  encodeDraw: (uniforms, options) => {
    // draw quad
    gl.bindVertexArray(quadVertexArray);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
});

//renderPassRandoms.config();
//renderPassGradient.config();
finalRenderPass.config();

render();

function render() {
  console.log('frame');
  // TODO: decide which framebuffers need a clear?
  //gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // -- pass 1: render randoms
  //offscreenFramebuffer.encode(attachmentKeys, () => renderPassRandoms.encode(uniforms, options));
  //offscreenFramebuffer.cleanupEncode();

  // -- Pass 2: render gradient from particle location
  // -  (and new particle locations in vertex shader?)
  //offscreenFramebuffer.encode(attachmentKeys, () => renderPassGradient.encode(uniforms, options));
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

  requestAnimationFrame(render);
}

function cleanup() {

}