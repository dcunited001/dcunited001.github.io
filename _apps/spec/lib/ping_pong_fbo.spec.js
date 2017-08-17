import { PingPongFBO } from '../../lib/ping_pong_fbo.js';
const twgl = require('twgl.js');

const fboPongerMax = 3;
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2');

var colorBufferFloatExt = gl.getExtension('EXT_color_buffer_float');
if (!colorBufferFloatExt) {
  console.error("EXT_color_buffer_float not supported.")
}

const FBO_WIDTH = 32, FBO_HEIGHT = 32;

describe('PingPongFBO', () => {
  var fboPonger;
  var smallTextureOptions, smallTextureFunc, smallTextureFuncColor;

  before(() => {

    smallTextureOptions = {
      target: gl.TEXTURE_2D,
      width: FBO_WIDTH, height: FBO_HEIGHT,
      format: gl.RGBA,
      internalFormat: gl.RGBA32F,
      type: gl.FLOAT,
      min: gl.NEAREST,
      wrap: gl.CLAMP_TO_EDGE
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

  });

  beforeEach(() => {
    fboPonger = new PingPongFBO(gl, {
      width: FBO_WIDTH,
      height: FBO_HEIGHT,
      max: 3,
      textureOptions: {
        smallTexture: Object.assign({}, smallTextureOptions, {
          src: smallTextureFunc
        }),
        smallTextureMonad: Object.assign({}, smallTextureOptions, {
          wrap: gl.REPEAT,
          src: smallTextureFuncColor,
          srcArgs: {
            color: [1.0, 0.0, 0.0, 1.0]
          }
        })
      },
      attachments: [{
        attachmentId: 'smallTexture',
        level: 0
      }, {
        attachmentId: 'smallTextureMonad',
        level: 0
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
    for (var i = 0; i < fboPongerMax; i++) {
      var fbo = fboPonger.getCurrentFbo();

      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fbo);
      expect(gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE)).to.equal(gl.TEXTURE);
      expect(gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL)).to.equal(0);
      expect(gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE)).to.equal(gl.TEXTURE);
      expect(gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL)).to.equal(0);;
      expect(gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER)).to.equal(gl.FRAMEBUFFER_COMPLETE);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);

      fboPonger.increment();
    }
  });

  it("can fetch data from an fbo attachment using readPixels()", () => {
    var fooPixels = new Float32Array(32 * 32 * 4).fill(16);
    fboPonger.readAttachmentPixels('smallTextureMonad', gl, 0, 0, fboPonger.width, fboPonger.height, fooPixels);
    expect(fooPixels.subarray(0,4)).to.eql(new Float32Array([1,0,0,1]));
  });

  // it("can generate, update, regenerate a texture via a monoid or a set of sourcetypes", () => {
  //
  // });

});
