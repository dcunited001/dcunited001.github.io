import {MipReducerAttachment, MipReducer} from '../../utils/MipReducer.js';
var twgl = require('twgl.js');

"use strict";

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

    // TODO: gl extensions
    this._paused = false;
    this._programs = options.programs || {};
    this._ui = ui;
  }

  // TODO: handle cpu-time/simulation-time, elapsed/etc

  get paused() {
    return this._paused;
  }

  set paused(paused) {
    this._paused = paused;
  }

  get programs() {
    return this._programs;
  }

  setProgram(k, program) {
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
    // if (options.events) {
    //   for (var k of Object.keys(options.events)) {
    //     this._el.addEventHandlers(k, options.events[k], false);
    //   }
    // }
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


}


function runWebGL() {
  // config canvas and get context


  // create glsl programs

  btnPlay
  btnMic

  var animationControls = {
    btnPlay: AnimationControl(document.getElementById('btn-play')),
    btnMic: AnimationControl(document.getElementById('btn-mic'))
  };

  var animationUI = new AnimationUI({
    particleCount: new AnimationInput(document.getElementById('particle-count')),
    simulationRate: new AnimationInput(document.getElementById('simulation-rate')),
    rCoefficient: new AnimationInput(document.getElementById('r-coefficient')),
    fieldSize: new AnimationInput(document.getElementById('field-size')),
    clampField: new AnimationInput(documents.getElementById('clamp-field'))
  });

  var animation = Animation(animationUI);

  animationControls.btnPlay.el.addEventHandlers('click', (e) => {
    animation.paused = !animation.paused;
    console.log('clicked play');
  });

  // TODO: where to set up UI events

}
