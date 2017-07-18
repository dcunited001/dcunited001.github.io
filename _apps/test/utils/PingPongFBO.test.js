import test from 'tape';
import { PingPongFBO } from '../../lib/PingPongFBO.js';

"use strict";

test('there is a class called PingPongFBO', t => {

  t.plan(1);

  var pingPongFBO = new PingPongFBO();

  t.equal(pingPongFBO.constructor.name, 'PingPongFBO', 'hello strange new javascript world.')

});


// TODO: test generatePrefix()
// TODO: test #version
// TODO: test #extension
// TODO: test precision
// TODO: test #define