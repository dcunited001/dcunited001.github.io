import test from 'tape';
import { Animation, El as Input, Timer } from '../../lib/animation.js';

console.log('testing: prefix');

test("Timer keeps track of four values in deltaT array, hoping one day to implement Runge-Kutta on some diff-eq vector fields", function(t) {
  t.plan(2);

  var timer = new Timer();
  var startTime = Date.now();

  timer.run(startTime);
  t.equal(timer.deltaT, new Float32Array([0, 0, 0, 0]), "∂t is empty");

  timer.update(startTime + 50);
  timer.update(startTime + 75);
  timer.update(startTime + 100);
  timer.update(startTime + 200);

  t.equal(timer.deltaT, new Float32Array([100, 25, 25, 50]), "∂t is correct");
});


test("Timer can keep track of time and fps and even pause itself", function(t) {
  t.plan(9);

  var timer = new Timer();
  t.equal(true, timer.paused, "timer's paused.");

  var startTime = Date.now(), interval = 100;
  timer.run(startTime);

  t.equal(0, timer.lastFrame);
  t.equal(false, timer.paused, "timer's no longer paused.");

  var nextTime = startTime + interval;
  timer.update(nextTime);

  t.equal(interval, timer.lastFrame);
  t.equal(interval, timer.elapsed);
  t.equal(interval, timer.simulated);

  timer.togglePause();
  nextTime = nextTime + interval;

  timer.update(nextTime);
  t.equal(interval, timer.lastFrame);
  t.equal(2*interval, timer.elapsed);
  t.equal(interval, timer.simulated);

  timer.togglePause();
  nextTime = nextTime + interval;
  console.log('fdsa' + nextTime);


  t.end();
});

console.log("finished: animation");