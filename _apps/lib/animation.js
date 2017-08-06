import { mat2, mat2d, mat3, mat4, quat, vec2, vec3, vec4 } from 'gl-matrix';

// decide whether user typically extends the animation class (maybe..)
// TODO: decide on how to structure animation state

// TODO: force splatting in chunks with instancing and uniform blocks
// - https://learnopengl.com/#!Advanced-OpenGL/Advanced-GLSL

class Animation {

  constructor() {
    this._timer = new Timer();
    this._state = {};
  }

  isPaused() {
    return this._timer.paused;
  }

  render() {
    // TODO: update time & simulation time

    var inputValues = this._ui.inputValues();

    // TODO: what options should the block or RenderPasses expect?
    this._draw.bind(this)();

    requestAnimationFrame(this.render);
  }

}

class AnimationEl {

  constructor(el, options = {}) {
    this._el = el;
    this._hasValue = options.hasValue || false;

    if (this._hasValue) {
      this._getValue = options.getValue ||
        (() => {
          return this._el.value;
        });
      this._setValue = options.setValue ||
        ((newValue) => {
          this._el.value = newValue;
        });
    }
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
    this._getValue = accessor || (() => {});
  }

  set setValue(mutator) {
    this._setValue = mutator || ((n) => {});
  }

  handleEvent(event) {
    let handler = this._events[event.type];
    if (handler) {
      // https://www.thecssninja.com/javascript/handleevent
    }
  }

  registerEvent(type, handler) {
    this._el.addEventListener(type, this, false);
    this._events[type] = handler;

    // TODO: provide animation in handler context to enable mutation of animation state
  }

}

class AnimationTimer {

  constructor() {
    this._paused = true;
  }

  run(t = Date.now()) {
    this._start = t;
    this._current = this._start;
    this._elapsed = this._current - this._start;
    this._lastFrameStart = this._current;
    this._lastFrame = this._current - this._lastFrameStart;
    // TODO: simulatedStart/current to keep track of total simulation time
    this._simulated = this._lastFrame;
    this._deltaT = new Float32Array([0, 0, 0, 0]);
    this._paused = false;
  }

  update(t = Date.now()) {
    this._lastFrameStart = this._current;
    this._lastFrame = this._current - this._lastFrameStart;
    this._current = t;
    this._elapsed = this._current - this._start;
    this._simulated += (this.paused ? 0 : this._lastFrame);

    this.updateDeltaT(this._lastFrame);
  }

  updateDeltaT(dt) {
    console.log(this._deltaT.subarray(0,4));
    this._deltaT.set(this._deltaT.subarray(0,3), 1);
    this._deltaT[0] = dt;
  }

  get paused() { return this._paused; }
  set paused(p) { this._paused = p; }

  togglePause() {
    this._paused = !this.paused;
  }

  get start() {
    return this._start;
  };

  get current() {
    return this._current;
  }

  get elapsed() {
    return this._elapsed;
  }

  get simulated() {
    return this._simulated;
  }

  get lastFrameStart() {
    return this._lastFrameStart;
  }

  get lastFrame() {
    return this._lastFrame;
  }

  get deltaT() {
    return this._deltaT;
  }
}

export { Animation, AnimationEl as El, AnimationTimer as Timer };
