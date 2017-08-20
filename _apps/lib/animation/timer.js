class Timer {

  constructor() {
    this._paused = true;
    this._started = false;
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
    this._started = true;
    this._paused = false;
  }

  update(t = Date.now()) {
    this._lastFrameStart = this._current;
    this._current = t;
    this._lastFrame = this._current - this._lastFrameStart;
    this._elapsed = this._current - this._start;
    this._simulated += (this.paused ? 0 : this._lastFrame);

    this.updateDeltaT(this._lastFrame);
  }

  updateDeltaT(dt) {
    this._deltaT.set(this._deltaT.subarray(0,3), 1);
    this._deltaT[0] = dt;
  }

  get started() { return this._started; }
  set started(s) { this._started = s; }
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

export { Timer };