const twgl = require('twgl.js');

class PingPongFBO {

  constructor(gl, options = {}) {
    this._max = options.max || 2;
    this._width = options.width;
    this._height = options.height;
    this._current = 0;
    this._attachments = options.attachments || [];
    this._attachmentIndex = {};
    this._textureOptions = options.textureOptions || {};
    this._framebuffers = [];
    this._textures = {};

    this._keys = this._attachments.map((a, i) => {
      if (typeof a.attachmentId != 'string') {
        throw "Attachment ID null or undefined"
      }
      return a.attachmentId;
    });

    this._setupAttachmentOptions();
    this._setupTextures(gl);
    this._setupFramebuffers(gl);
    this._setupAttachmentIndex();
  }

  get width() { return this._width; }
  get height() { return this._height; }
  get attachments() { return this._attachments; }
  get keys() { return this._keys; }
  get current() { return this._current; }
  get max() { return this._max; }
  get framebuffers() { return this._framebuffers; }

  getAttach(k) {
    return this._attachmentIndex[k].attach;
  }

  getIndex(k) {
    return this._attachmentIndex[k].index;
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

  /*
   * initialize this._textures and generate attachments from values shared by textureOptions
   */
  _setupAttachmentOptions() {
    for (var i = 0; i < this._keys.length; i++) {
      var k = this._keys[i];
      this._textures[k] = [];
      Object.assign(this._attachments[i],
        (({ format, type, target }) => ({format, type, target}))(this._textureOptions[k]));

      this._attachments[i].format = this._attachments[i].format || gl.RGBA;
      this._attachments[i].internalFormat = this._attachments[i].format || gl.RGBA;
    }
  }

  /*
   * generate WebGL texture objects from textureOptions
   */
  _setupTextures(gl) {
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
  }

  /*
   * create framebuffers from attachmentOptions and configure attachments
   */
  _setupFramebuffers(gl) {
    for (var fboIndex = 0; fboIndex < this._max; fboIndex++) {
      var newFbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, newFbo);

      for (const [i,k] of this._keys.entries()) {
        var attachment = this._attachments[i];
        attachment.attach = attachment.attach || (gl.COLOR_ATTACHMENT0 + i);
        var attachmentObject = this.getNext(k);

        if (attachmentObject instanceof WebGLTexture) {
          gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, attachment.attach, attachment.target, attachmentObject, attachment.level);
        } else if (attachmentObject instanceof WebGLRenderbuffer) {
          gl.framebufferRenderbuffer(gl.DRAW_FRAMEBUFFER, attachment.attach, attachment.target, attachmentObject);
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

  /*
   * setup an index of attachment id's and fbo attachment id's
   */
  _setupAttachmentIndex() {
    for (const [i,k] of this._keys.entries()) {
      this._attachmentIndex[k] = {
        index: i,
        attach: this._attachments[i].attach
      };
    }
  }

}

export { PingPongFBO };
