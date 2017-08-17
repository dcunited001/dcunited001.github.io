import { PingPongFBO } from '../../lib/ping_pong_fbo.js';
const twgl = require('twgl.js');

const fboPongerMax = 3;
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2');

describe('PingPongFBO', () => {
  var fboPonger;
  var smallTextures, smallTextureOptions, smallTextureFunc, smallTextureFuncColor;

  before(() => {

    smallTextureOptions = {
      target: gl.TEXTURE_2D,
      width: 32, height: 32,
      format: gl.RGBA,
      internalFormat: gl.RGBA32F,
      type: gl.FLOAT
    };

    // sets the texture to black
    smallTextureFunc = (gl, opts) => {
      return new Float32Array(opts.width * opts.height * 4);
    };

    // sets the texture to a solid color, with args given at eval time
    smallTextureFuncColor = (gl, opts) => {
      var data = new Float32Array(opts.width * opts.height * 4);
      data = data.map((a, i) => {
        return (opts.srcArgs || {}).color[i % 4] || 0;
      });

      return data;
    };

    smallTextures = new Array(fboPongerMax).fill(0).map((_,i) => {
      return twgl.createTexture(gl, Object.assign({}, smallTextureOptions, { src: smallTextureFunc }));
    });

  });

  beforeEach(() => {
    fboPonger = new PingPongFBO(gl, {
      max: 3,
      textureOptions: {
        smallTexture: Object.assign({}, smallTextureOptions, {
          src: smallTextureFunc
        }),
        smallTextureMonad: Object.assign({}, smallTextureOptions, {
          src: smallTextureFuncColor,
          srcArgs: {
            color: [1.0, 0.0, 0.0, 1.0]
          }
        }),
        smallTexturePregen: smallTextures
      },
      attachments: [{
        attachmentId: 'smallTexture',
        level: 0
      },
        {
        attachmentId: 'smallTextureMonad',
          level: 0
        // level: 1
      }, {
        attachmentId: 'smallTexturePregen',
          level: 0
        // level: 2
      }]
    });
  });

  it("creates 'max' number of textures per fbo attachment and cycles through framebuffers", () => {
    expect(fboPonger.getCurrentId()).to.equal(0);
    expect(fboPonger.getPrevId()).to.equal(fboPonger.max - 1);
    expect(fboPonger.getNextId()).to.equal(1);

    for (var i = 0; i < fboPonger.max - 1; i++) {
      fboPonger.increment();
    }

    expect(fboPonger.getCurrentId()).to.equal(fboPonger.max - 1);
    expect(fboPonger.getPrevId()).to.equal(fboPonger.max - 2);
    expect(fboPonger.getNextId()).to.equal(0);
  });

  it("can retrieve the proper textures and fbo's", () => {
    var fboAttrs = new Array(3).fill({
      smallTexture: {},
      smallTextureMonad: {},
      smallTexturePregen: {}
    });

    for (var i = 0; i < fboPongerMax; i++) {
      var fbo = fboPonger.getCurrentFbo();

      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fbo);
      fboAttrs[i].smallTexture.type = gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE);
      fboAttrs[i].smallTexture.name = gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
      fboAttrs[i].smallTexture.level = gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL);
      // fboAttrs[i].smallTextureMonad.type = gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE);
      // fboAttrs[i].smallTextureMonad.name = gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
      // fboAttrs[i].smallTextureMonad.level = gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_LEVEL);
      // fboAttrs[i].smallTexturePregen.type = gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE);
      // fboAttrs[i].smallTexturePregen.name = gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
      // fboAttrs[i].smallTexturePregen.level = gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_LEVEL);
      // expect(gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER)).to.equal(gl.FRAMEBUFFER_COMPLETE);
      console.log(gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER));
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);

      var fooPixels = new Float32Array(32 * 32 * 4).fill(16);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      console.log(gl.checkFramebufferStatus(gl.FRAMEBUFFER));
      gl.readPixels(0,0,32,32,gl.RGBA, gl.FLOAT, fooPixels);


      console.log(fooPixels[0]);
      console.log(fboAttrs[i]);
      fboPonger.increment();
    }

    console.log(fboAttrs);

  });

  // it("can fetch data from an fbo attachment using readPixels()", () => {
  //
  // })
  //
  // it("can generate, update, regenerate a texture via a monoid or a set of sourcetypes", () => {
  //
  // });

});
