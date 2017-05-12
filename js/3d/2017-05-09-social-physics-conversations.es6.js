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

  constructor(context, program, options = {uniformLocations: {}}) {
    this._program = program;
    this._context = context;
    this._uniformLocations = options.uniformLocations || {};
    delete options.uniformLocations;
    this._options = options;
  }

  get program() { return this._program; }
  set program(program) { this._program = program; }
  get context() { return this._context; }
  set context(context) { this._context = context; }
  get options() { return this._options; }
  set options(options) { this._options = options; }

  get uniformLocations() {
    return this._uniformLocations;
  }

  set uniformLocations(uniformLocations) {
    this._uniformLocations = uniformLocations;
  }

  static getUniformLocations(program, keys) {
    var uniformLocations = {};
    for (var k of keys) {
      uniformLocations[k] = this.context.getUniformLocation(this.program, k);
    }
    return uniformLocations
  }

  encode(uniforms, options = {}) {
    var ops = Object.assign({}, this.options, options);

    this.context.useProgram(this.program);

    // for each key in uniforms, encode value into the specific location
    if (ops.beforeEncode !== undefined) {
      ops.beforeEncode(this.context, uniforms, ops);
    }

    if (ops.encodeUniforms !== undefined) {
      ops.encodeUniforms(this.context, uniforms, ops);
    } else {
      this.encodeUniforms(this.context, uniforms, ops);
    }

    if (ops.encodeClear !== undefined) {
      ops.encodeClear(this.context, uniforms, ops);
    }

    if (ops.encodeTextures !== undefined) {
      ops.encodeTextures(this.context, uniforms, ops);
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
    console.error("RenderPass: override encodeUniforms() or pass 'encodeUniforms'")
  }

  encodeDraw(c, uniforms, options = {}) {
    console.error("RenderPass: override encodeDraw() or pass 'encodeDraw'")
  }

  cleanupEncode() {
    this._context.bindBuffer(this._context.ARRAY_BUFFER, null);
    this._context.bindVertexArray(null);
    this._context.useProgram(null);
  }
}

class PingPongProvider {

}


window.onload = function() {
  render();
};
