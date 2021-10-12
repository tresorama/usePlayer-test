import GenericEmitter from "./utilities/GenericEmitter";

function FullscreenController() {
  return {
    _element: null,
    setElement(el) {
      this._element = el;
      this.registerEmitter();
    },
    destroy() {
      this.destroyEmitter();
    },
    // EMITTER
    _emitter: null,
    registerEmitter() {
      this._emitter = new GenericEmitter();
      this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
      this._element.addEventListener("fullscreenchange", this.handleFullscreenChange);
    },
    destroyEmitter() {
      this._element.removeEventListener("fullscreenchange", this.handleFullscreenChange);
    },
    get onFullscreenChange() {
      return this._emitter;
    },
    handleFullscreenChange() {
      this._emitter.fire(this.isInFullscreenNow);
    },

    // STATUS
    get isInFullscreenNow() {
      const elementInFullScreenNow =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      if (elementInFullScreenNow) {
        if (this._element === elementInFullScreenNow) {
          return true;
        }
      }
      return false;
    },
    getStatus() {
      return {
        el: this._element,
        isFullscreen: this.isInFullscreenNow,
      };
    },

    // ACTION
    async enableFullscreen() {
      const el = this._element;
      let error;

      try {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          await el.msRequestFullscreen();
        }
        throw new Error("Browser Not Support FULLSCREEN API");
      } catch (err) {
        error = err;
      }

      return { ...this.getStatus(), error };
    },
    async disableFullscreen() {
      // REMEMBER => exitFullscreen exist only on Document, not on Element
      const doc = window.document;
      let error;

      try {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
        throw new Error("Browser Not Support FULLSCREEN API");
      } catch (err) {
        error = err;
      }

      return { ...this.getStatus(), error };
    },
    async toggleFullscreen() {
      if (this.isInFullscreenNow) {
        return this.disableFullscreen();
      } else {
        return this.enableFullscreen();
      }
    },
  };
}

export default FullscreenController;
