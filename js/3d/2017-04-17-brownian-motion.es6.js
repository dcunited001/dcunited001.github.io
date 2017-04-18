'use strict';

function createShader(gl, source, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

window.createProgram = function(gl, vertexShaderSource, fragmentShaderSource) {
  var program = gl.createProgram();
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

var gl = canvas.getContext( 'webgl2', { antialias: false } );
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
  shaderFragment = document.getElementById('shaderFragment').textContent;

var programRandomTexture = createProgram(gl, shaderVertexPassthrough, shaderRandoms);
var program = createProgram(gl, shaderVertex, shaderFragment);

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
gl.vertexAttributePointer(quadVertexPosIndex, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(quadVertexPosIndex);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var quadVertexTexIndex = 4;
gl.bindBuffer(gl.ARRAY_BUFFER, quadVertexPosBuffer);
gl.vertexAttributePointer(quadVertexTexIndex, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(quadVertexTexIndex);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

gl.bindVertexArray(null);

// =======================================
// color attachments for render pipeline
// =======================================

var attachment0, attachment1;

gl.activeTexture(gl.TEXTURE0);
attachment0 = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, attachment0);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

gl.texImage2D(gl.TEXTURE_2D,
  0,
  gl.RGBA,
  windowSize.x,
  windowSize.y,
  0,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  null);

gl.activeTexture(gl.TEXTURE1);
attachment1 = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, attachment1);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

gl.texImage2D(gl.TEXTURE_2D,
  0,
  gl.RGBA,
  PARTICLE_TEXTURE_HEIGHT,
  PARTICLE_TEXTURE_WIDTH,
  0,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  null);

// -- initialize frame buffer
var frameBuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, frameBuffer);
gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, color1Texture, 0);
gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, color2Texture, 0);

gl.drawBuffers([
  gl.COLOR_ATTACHMENT0,
  gl.COLOR_ATTACHMENT1
]);

var status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
if (status != gl.FRAMEBUFFER_COMPLETE) {
  console.log('fb status: ' + status.toString(16));
}

gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);

var mvMatrixLocation = gl.getUniformLocation(program, 'mvMatrix');
var pMatrixLocation = gl.getUniformLocation(program, 'pMatrix');
var diffuseLocation = gl.getUniformLocation(program, 'diffuse');
var displacementMapLocation = gl.getUniformLocation(program, 'displacementMap');

gl.useProgram(program);
gl.uniform1i(diffuseLocation, 0);
gl.uniform1i(displacementMapLocation, 0);

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


function render() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //orientation[0] = 0.00020; // yaw
  //orientation[1] = 0.00010; // pitch
  //orientation[2] = 0.00005; // roll

  //mat4.rotateX(mvMatrix, mvMatrix, orientation[0] * Math.PI);
  //mat4.rotateY(mvMatrix, mvMatrix, orientation[1] * Math.PI);
  //mat4.rotateZ(mvMatrix, mvMatrix, orientation[2] * Math.PI);

  requestAnimationFrame(render);
}