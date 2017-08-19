import { ShaderGraph } from '../../vendor/bower/shadergraph/build/shadergraph.js';
import { rStats } from 'rstatsjs/src/rStats';
import { GUI } from 'dat.gui/build/dat.gui';

import { MipReducerAttachment, MipReducer } from '../../lib/MipReducer.js';

import { PingPongFBO } from "../../lib/ping_pong_fbo"
import { Animation, Input as AniInput, Timer, Platform as AniPlatform } from '../../lib/animation.js';

const twgl = require('twgl.js');

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

function platformWarnings(gl) {
  var container = document.getElementById('animation-alerts');

  if (!AniPlatform.checkEs6()) { AniPlatform.appendLabel(container, "Requires ES6"); }
  if (AniPlatform.checkMobile()) { AniPlatform.appendLabel(container, "Requires Desktop Browser"); }
  if (!!gl) { AniPlatform.appendLabel(container, "Requires WebGL2"); }
}

platformWarnings(gl);
console.log

var gui = new GUI();

var canvas = document.getElementById('main-canvas');
var gl = canvas.getContext('webgl2', {antialias: true});

function setupDatGUI(gui, data, container) {
  container.appendChild(gui.domElement);

  gui.add(data.particleCount, 'Particle Count', 32, 2048);

  var rFieldGui = gui.addFolder('R-Field');
  rFieldGui.add(data.rField.coefficient, 'coefficient').min(0.001).max(10).step(0.0001);
  rFieldGui.add(data.rField.size, 'size').min(1).max(300).step(1);

}

function runWebGL() {
  var canvas = document.getElementById('main-canvas');

  // TODO: developer implements rStats
  // var rstats =

  // setup UI Controller objects
  // - plain js objects with a few functions
  //   - to help update values in gui from animation.state
  //   - to help apply presets triggered by an animation ui event (i.e. random values)

  // in animation, have an uiStateUpdate() method or callback
  // - so

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

  // TODO: set up render/draw method
  // TODO: wire up UI events
  // TODO: create shader prefix

  var vaoAttributes = ['a_position', 'a_texcoord'];

  // TODO: read in vs/fs programs




  // TODO: create textures/resources

  // TODO: create geometry

  // run
  
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
