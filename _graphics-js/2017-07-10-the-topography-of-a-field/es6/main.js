import { MipReducerAttachment, MipReducer } from '../../utils/MipReducer.js';
import { Quad } from '../../utils/Quad.js';
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

function runWebGL() {

}
