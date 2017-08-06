// TODO: assume that data passed for textures is always a Texture monoid
// - create using createFramebufferInfo()
// - pass in AttachmentOptions for each texture definition
//   - src: twgl.TextureFunc((gl, textureoptions) => {})

// TODO: how to test classes like this that rely heavily on WebGL

class PingPongFBO {

  constructor(options = {}) {
    // this._attachmentOptions = [];
    this._current = 0;
    this._max = options.max || 2;
    this._framebuffers = [];
  }


  //TODO: reimplemented getPrev(), getCurrent(), getNext()
  //TODO: reimplement mappings for fbo(i) => [attachments]

}

export { PingPongFBO };
