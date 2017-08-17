const twgl = require('twgl.js');

class PingPongFBO {

  constructor(gl, options = {}) {
    this._max = options.max || 2;
    this._current = 0;
    this._attachments = options.attachments || [];
    this._textureOptions = options.textureOptions || {};
    this._framebuffers = [];
    this._textures = {};

    // TODO: refactor constructor behaviors to helpers

    this._keyIndex = {};
    this._keys = this._attachments.map((a, i) => {
      if (typeof a.attachmentId != 'string') {
        throw "Attachment ID null or undefined"
      }
      this._keyIndex[a.attachmentId] = i;
      return a.attachmentId;
    });

    // init this._textures and generate attachments from values shared by textureOptions
    for (var k of this._keys) {
      this._textures[k] = [];
      var index = this._keyIndex[k];
      var textureOpts = this._textureOptions[k];

      Object.assign(this._attachments[index],
        (({ format, type, target }) => ({format, type, target}))(this._textureOptions[k]))
    }

    // generate textures from textureOptions
    for (var k of this._keys) {
      var textureOpts = this._textureOptions[k];
      if (textureOpts) {
        for (var fboIndex = 0; fboIndex < this._max; fboIndex++) {
          var texture = twgl.createTexture(gl, textureOpts);
          this._textures[k].push(texture);
        }
      } else {
        throw `TextureOptions[${k}] is null or undefined`
      }
    }

    // create framebuffers and configure attachments
    for (var fboIndex = 0; fboIndex < this._max; fboIndex++) {
      var newFbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, newFbo);

      for (const [i,k] of this._keys.entries()) {
        var attachment = this._attachments[i];
        var attachNumber = attachment.attach || (gl.COLOR_ATTACHMENT0 + i);
        var attachmentObject = this.getNext(k);

        if (attachmentObject instanceof WebGLTexture) {
          gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, attachNumber, attachment.target, attachmentObject, attachment.level);
        } else if (attachmentObject instanceof WebGLRenderbuffer) {
          gl.framebufferRenderbuffer(gl.DRAW_FRAMEBUFFER, attachNumber, attachment.target, attachmentObject);
        } else {
          throw "unknown attachment type";
          // TODO: handle TextureArray with gl.framebufferTextureLayer()
        }
      }

      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
      this._framebuffers.push(newFbo);
      this.increment();
    }
  }

  get attachments() { return this._attachments; }
  get keys() { return this._keys; }
  get current() { return this._current; }
  get max() { return this._max; }
  get framebuffers() { return this._framebuffers; }

  //TODO: keep getKeys() ?
  getKeys() {
    return this._keys.reduce((memo, k) => {
      memo[k] = this._keyIndex[k];
      return memo
    }, {});
  }

  getTexture(k, index, ...args) {
    return this._textures[k][index];
  }

  getCurrent(k, ...args) {
    var index = this.getCurrentId();
    return this.getTexture(k, index, ...args);
  }

  getNext(k,  ...args) {
    var index = this.getNextId();
    return this.getTexture(k, index, ...args);
  }

  getPrev(k, ...args) {
    var index = this.getPrevId();
    return this.getTexture(k, index, ...args);
  }

  getCurrentFbo() {
    return this._framebuffers[this.getCurrentId()];
  }

  getCurrentId() {
    return this._current;
  }

  getNextId() {
    if (this._current === this._max - 1) {
      return 0;
    } else {
      return this._current + 1;
    }
  }

  getPrevId() {
    if (this._current === 0) {
      return this._max - 1;
    } else {
      return this._current - 1;
    }
  }

  increment() {
    if (this._current === this._max - 1) {
      this._current = 0;
    } else {
      this._current++;
    }
  }

  // TODO: reimplement mappings for fbo(i) => [attachments]
}

export { PingPongFBO };
