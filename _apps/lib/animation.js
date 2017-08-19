import { mat2, mat2d, mat3, mat4, quat, vec2, vec3, vec4 } from 'gl-matrix';

// decide whether user typically extends the animation class (maybe..)
// TODO: decide on how to structure animation state

// TODO: force splatting in chunks with instancing and uniform blocks
// - https://learnopengl.com/#!Advanced-OpenGL/Advanced-GLSL

class Animation {

  constructor() {
    this._timer = new Timer();
    this._state = {};
  }

  isPaused() {
    return this._timer.paused;
  }

  render() {
    // TODO: update time & simulation time

    var inputValues = this._ui.inputValues();

    // TODO: what options should the block or RenderPasses expect?
    this._draw.bind(this)();

    requestAnimationFrame(this.render);
  }

}

class AnimationEl {

  constructor(el, options = {}) {
    this._el = el;
    this._hasValue = options.hasValue || false;

    if (this._hasValue) {
      this._getValue = options.getValue ||
        (() => {
          return this._el.value;
        });
      this._setValue = options.setValue ||
        ((newValue) => {
          this._el.value = newValue;
        });
    }
  }

  get el() {
    return this._el;
  }

  set el(el) {
    this._el = el;
  }

  get value() {
    return this._getValue.bind(this)();
  }

  set value(newValue) {
    this._setValue.bind(this)(newValue);
  }

  set getValue(accessor) {
    this._getValue = accessor || (() => {});
  }

  set setValue(mutator) {
    this._setValue = mutator || ((n) => {});
  }

  handleEvent(event) {
    let handler = this._events[event.type];
    if (handler) {
      // https://www.thecssninja.com/javascript/handleevent
    }
  }

  registerEvent(type, handler) {
    this._el.addEventListener(type, this, false);
    this._events[type] = handler;

    // TODO: provide animation in handler context to enable mutation of animation state
  }

}

class AnimationTimer {

  constructor() {
    this._paused = true;
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
    this._paused = false;
  }

  update(t = Date.now()) {
    this._lastFrameStart = this._current;
    this._lastFrame = this._current - this._lastFrameStart;
    this._current = t;
    this._elapsed = this._current - this._start;
    this._simulated += (this.paused ? 0 : this._lastFrame);

    this.updateDeltaT(this._lastFrame);
  }

  updateDeltaT(dt) {
    console.log(this._deltaT.subarray(0,4));
    this._deltaT.set(this._deltaT.subarray(0,3), 1);
    this._deltaT[0] = dt;
  }

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

class AnimationInspectPlatform {

  static appendLabel(container, message, options = { icon: "info-sign", bsColor: "danger" }) {
    var bsGlyph = options.bsGlyph, bsColor = options.bsColor;
    var labelSpan = document.createElement('span');
    labelSpan.classList.add('label', `label-${bsColor}`, 'animation-alert');

    var glyph = `<i class="fa fa-lg fa-info-circle"></i>&nbsp;`;
    labelSpan.innerHTML = glyph + message;

    container.appendChild(labelSpan);
  }

  static checkEs6() {
    try {
      return ('function' === typeof Map)
    } catch (e) {
      return false;
    }
  }

  static checkMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  // TODO: abstract this fix for canvas in chrome
  // function fixCanvasUIBar() {
  //   // this might be a bug in the browser, but it's happening in both Firefox & Chrome
  //
  //   var uiBar = document.getElementById('canvas-ui-bar-bottom');
  //   var canvasHeight = window.getComputedStyle(document.getElementById('main-canvas')).height;
  //   var containerHeight = window.getComputedStyle(document.getElementById('main-canvas-container')).height;
  //
  //   canvasHeight = parseFloat(canvasHeight.substr(0, canvasHeight.length - 2));
  //   containerHeight = parseFloat(containerHeight.substr(0, containerHeight.length - 2));
  //
  //   var shadowPaddingHeight = canvasHeight - containerHeight;
  //   if (shadowPaddingHeight < 0) {
  //     uiBar.style.marginTop = `${shadowPaddingHeight}px`
  //   }
  // }

}

export { Animation, AnimationInput as Input, AnimationTimer as Timer, AnimationInspectPlatform as Platform };
