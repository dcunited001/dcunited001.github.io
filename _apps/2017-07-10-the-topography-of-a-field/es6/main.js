import { MipReducerAttachment, MipReducer } from '../../lib/MipReducer.js';
import { ShaderGraph } from '../../vendor/bower/shadergraph/'

var twgl = require('twgl.js');

"use strict";

// TODO: abstract mic/fft as service/factory
// TODO: set up shaders to use twgl.createProgram & createProgramInfo
// TODO: update RenderPass to use uniforms/attributes on ProgramInfo
// TODO: refactor fixCanvasUIBar to a common util
// TODO: reimplement PingPongProvider to use:
// - twgl framebuffer interface
// - twgl created textures & attachments?
// TODO: change Quad to twgl.primitives.createPlane()
// TODO: figure out how to be flexible with twgl VAO interface
// TODO: abstract UI: logic & two-way databinding abstracted from render() flow
// TODO: abstract reloading texture data
// TODO: ensure mipmap & lineplot behavior is mostly in tact

var UINT32_MAX = (2 ** 32) - 1;
var INT32_MAX = (2 ** 31) - 1;

class RenderPass {
  constructor(programInfo, options = {}) {
    this._programInfo = progamInfo;
  }

  get programInfo() {
    return this._programInfo;
  }

  set programInfo(programInfo) {
    this._programInfo = programInfo;
  }

  // TODO: remove uniformLocations use those attached to ProgramInfo
}

class PingPonger {
  // TODO: set up framebuffers & link cyclically
  // TODO: set up getNext(), getCurrent() access for textures
  // TODO: set up getNext(), getCurrent() access for fbo's
}

class Animation {

  constructor(ui, options = {}) {
    // TODO: decide whether to init context in/outside of Animation class
    // - or just attach the context to the animation, since canvas has no refs

    // TODO: timing

    // TODO: gl extensions
    this._paused = false;
    this._programs = {};
    this._ui = ui;

  }

  // TODO: handle cpu-time/simulation-time, elapsed/etc

  get paused() {
    return this._paused;
  }

  togglePaused() {
    this._paused = !this._paused;
  }

  get programs() {
    return this._programs;
  }

  addProgram(k, program) {
    this._programs[k] = program;
  }

  // TODO: paused

  render() {
    // TODO: update time & simulation time

    var inputValues = this._ui.inputValues();
    // TODO: run a block passed in that iterates through renderpasses
    // -
  }

}

class AnimationUI {
  constructor(canvas, controls = {}, inputs = {}, options = {}) {
    this._canvas = canvas;
    this._inputs = inputs;
    this._controls = controls;
  };

  get canvas() {
    return this._canvas;
  }

  get inputs() {
    return this._inputs;
  }

  get controls() {
    return this._controls;
  }

  inputValues() {
    return Object.keys(this.inputs())
      .reduce((acc, k) => {
        acc[k] = this._ui.value;
        return acc;
      }, {});
  }
}

class AnimationInput {
  constructor(el, options = {}) {
    this._el = el;
    this._getValue = options.getValue ||
      (() => {
        return this._el.value;
      });
    this._setValue = options.setValue ||
      ((newValue) => {
        this._el.value = newValue;
      });
  }

  get el() {
    return this._el;
  }

  set el(el) {
    this._el = el;
  }

  get value() {
    return this._getValue.bind(this)();
  }

  set value(newValue) {
    this._setValue.bind(this)(newValue);
  }

  set getValue(accessor) {
    this._getValue = accessor;
  }

  set setValue(mutator) {
    this._setValue = mutator;
  }
}

class AnimationControl {
  // an input, but without a value

  constructor(el, options = {}) {
    this._el = el;
  }

  get el() {
    return this._el;
  }

  setupEvents(events = {}) {
    for (var k of Object.keys(options.events)) {
      this._el.addEventHandlers(k, options.events[k], false);
    }
  }
}

class ShaderSnippetProcessor {

  constructor(options = {}) {
    this._snippets = {};
  }

  get snippets() { return this._snippets; }

  addSnippet(k, snippet) {
    this._snippets[k] = snippet;
  }

}

class ShaderSnippet {
  constructor(options = {}) {

  }

  generate(input = {}) {

  }
}

function runWebGL() {
  var canvas = document.getElementById('main-canvas');

  var animationControls = {
    btnPlay: new AnimationControl(document.getElementById('btn-play')),
    btnMic: new AnimationControl(document.getElementById('btn-mic')),
    btnParticleReset: new AnimationControl(document.getElementById('btn-particle-reset'))
  };

  var animationInputs = {
    particleCount: new AnimationInput(document.getElementById('particle-count')),
    simulationRate: new AnimationInput(document.getElementById('simulation-rate')),
    rCoefficient: new AnimationInput(document.getElementById('r-coefficient')),
    fieldSize: new AnimationInput(document.getElementById('field-size')),
    clampField: new AnimationInput(documents.getElementById('clamp-field'))
  };

  var animationUI = new AnimationUI(canvas, animationInputs, animationControls, {});

  var animation = Animation(animationUI);

  // TODO: wire up UI events

  // TODO: create shader prefix

  var vaoAttributes = ['a_position', 'a_texcoord'];

  // TODO: read in vs/fs programs




  // TODO: create textures
  
}



// TODO: render pass
class RenderPass {
  // render pass is mostly handled by twgl
  // - already encodes uniforms
  // - already encodes textures with samplers

  // TODO:
  //   - encode gl.drawBuffers();
  //   - set blending & stenciling options
}
