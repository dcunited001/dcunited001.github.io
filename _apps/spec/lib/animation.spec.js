import { Animation, El as Input, Timer } from '../../lib/animation.js';

// describe("Animation", () => {
//
// });

describe("Timer", () => {

  it('keeps track of four values in deltaT array, hoping one day to implement Runge-Kutta on some diff-eq vector fields', () => {
    var timer = new Timer();
    var startTime = Date.now();

    timer.run(startTime);
    expect(timer.deltaT).to.eql(new Float32Array([0, 0, 0, 0]), "∂t is empty");

    timer.update(startTime + 50);
    timer.update(startTime + 75);
    timer.update(startTime + 100);
    timer.update(startTime + 200);

    expect(timer.deltaT).to.eql(new Float32Array([100, 25, 25, 50]), "∂t is correct");
  });

  it('Timer can keep track of time and fps and even pause itself', () => {
    var timer = new Timer();
    expect(timer.paused).to.be.true;

    var startTime = Date.now(), interval = 100;
    timer.run(startTime);

    expect(timer.lastFrame).to.equal(0);
    expect(timer.paused).to.be.false;

    var nextTime = startTime + interval;
    timer.update(nextTime);

    expect(timer.lastFrame).to.equal(interval);
    expect(timer.elapsed).to.equal(interval);
    expect(timer.simulated).to.equal(interval);

    timer.togglePause();
    nextTime = nextTime + interval;
    timer.update(nextTime);

    expect(timer.lastFrame).to.equal(interval);
    expect(timer.elapsed).to.equal(2*interval);
    expect(timer.simulated).to.equal(interval);

    timer.togglePause();
    nextTime = nextTime + interval;
    timer.update(nextTime);

    expect(timer.lastFrame).to.equal(interval);
    expect(timer.elapsed).to.equal(3*interval);
    expect(timer.simulated).to.equal(2*interval);
  });

});

// describe("Input", () => {
//
// });
