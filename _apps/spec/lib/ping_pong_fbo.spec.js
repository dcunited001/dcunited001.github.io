import { PingPongFBO } from '../../lib/ping_pong_fbo.js';

describe('PingPongFBO', () => {
  it('is a class called PingPongFBO', () => {
    var pingPongFBO = new PingPongFBO();
    expect(pingPongFBO.constructor.name).to.equal('PingPongFBO');
  });
});

// TODO: test generatePrefix()
// TODO: test #version
// TODO: test #extension
// TODO: test precision
// TODO: test #define
