// import { mat2, mat2d, mat3, mat4, quat, vec2, vec3, vec4 } from 'gl-matrix';
import { Timer } from './timer.js';

// TODO: force splatting in chunks with instancing and uniform blocks
// - https://learnopengl.com/#!Advanced-OpenGL/Advanced-GLSL

const NOOP = (...args) => {};

/**
 * Stores a timer, mediates animation state via input and runs a render loop
 */
class Animation {

  constructor(options = {}) {
    this._timer = new Timer();
    this._state = options.state || {};

    // updateState: update the animation state once per frame
    this._updateState = options.updateState || NOOP;
    this._update = options.update || NOOP;
    this._draw = options.draw || NOOP;
  }

  isPaused() {
    return this._timer.paused;
  }

  /**
   * start timer and call render()
   */
  run() {
    this._timer.run();
    this.render();
  }

  /**
   * run through render loop callbacks
   */
  render() {
    this._updateState();
    this._update();
    this._draw();

    this._timer.update();
    requestAnimationFrame(this.render);
  }

}

class Input {
  contructor(source, options = {}) {
    this._source = source;
    this._fetch = options.fetch || function () {
      return this._source.value;
    };
    this._update = options.update || function (newValue) {
      this.source.value = newValue;
    }
  }

  getValue() {
    return this._fetch.bind(this);
  }

  setValue(newValue) {
    return this._update.bind(this);
  }

  setFetch(accessor) {
    this._fetch = accessor || (() => {
    });

  }

  setUpdate(mutator) {
    this._update = mutator || ((n) => {
    });

  }
}

// handleEvent(event) {
//   let handler = this._events[event.type];
//   if (handler) {
//     // https://www.thecssninja.com/javascript/handleevent
//   }
// }
//
// registerEvent(type, handler) {
//   this._el.addEventListener(type, this, false);
//   this._events[type] = handler;
//
//   // TODO: provide animation in handler context to enable mutation of animation state
// }


export { Animation, Input, Timer };