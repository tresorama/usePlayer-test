import LOG from "./utilities/Log";
import { DEBUG_ON } from "./utilities/CONSTANTS";

const HTMLPlayerController = function () {
  return {
    _player: null,
    _mediaEventsHandlers: null,
    // INITIALIZERS
    setPlayer(mediaPlayerElement) {
      this._player = mediaPlayerElement;
    },
    setMediaEventsHandlers(mediaEventsHandlers) {
      this._mediaEventsHandlers = mediaEventsHandlers;
      if (this._mediaEventsHandlers) {
        this.bindMediaEvents();
        this.addMediaEventsListeners();
      }
    },
    destroy() {
      this._player = null;
      if (this._mediaEventsHandlers) {
        this.removeMediaEventsListeners();
      }
    },
    // ACTIONS
    setSource(src) {
      this._player.src = src;
    },
    getSource() {
      return this._player.currentSrc;
    },
    async play() {
      let outcome;

      try {
        await this._player.play();
        outcome = { name: "play", success: true };
      } catch (error) {
        outcome = { name: "play", success: false, error };
      }

      DEBUG_ON && LOG(outcome);
      return outcome;
    },
    pause() {
      this._player.pause();
    },
    setVolume(amountFrom0To100) {
      const inRange0To1 = amountFrom0To100 / 100;
      this._player.volume = inRange0To1;
    },
    setMuted(newState) {
      this._player.muted = newState;
    },
    setLoop(newState) {
      this._player.loop = newState;
    },
    setControlsVisible(newState) {
      this._player.controls = newState;
    },
    // GETTERS
    get isMuted() {
      return this._player.muted;
    },
    get isPaused() {
      return this._player.paused;
    },
    get isPlaying() {
      const pl = this._player;
      return !!(pl.currentTime > 0 && !pl.paused && !pl.ended && pl.readyState > 2);
    },
    // MEDIA EVENTS
    addMediaEventsListeners() {
      const media = this._player;

      media.addEventListener("abort", this.onMediaAbort);
      media.addEventListener("canplay", this.onMediaCanPlay);
      media.addEventListener("canplaythrough", this.onMediaCanPlayThrough);
      media.addEventListener("durationchange", this.onMediaDurationChange);
      media.addEventListener("emptied", this.onMediaEmptied);
      media.addEventListener("ended", this.onMediaEnded);
      media.addEventListener("error", this.onMediaError);
      media.addEventListener("loadeddata", this.onMediaLoadedData);
      media.addEventListener("loadedmetadata", this.onMediaLoadedMetadata);
      media.addEventListener("loadstart", this.onMediaLoadStart);
      media.addEventListener("pause", this.onMediaPause);
      media.addEventListener("play", this.onMediaPlay);
      media.addEventListener("playing", this.onMediaPlaying);
      media.addEventListener("progress", this.onMediaProgress);
      media.addEventListener("ratechange", this.onMediaRateChange);
      media.addEventListener("seeking", this.onMediaSeeking);
      media.addEventListener("seeked", this.onMediaSeeked);
      media.addEventListener("stalled", this.onMediaStalled);
      media.addEventListener("suspend", this.onMediaSuspend);
      media.addEventListener("timeupdate", this.onMediaTimeUpdate);
      media.addEventListener("volumechange", this.onMediaVolumeChange);
      media.addEventListener("waiting", this.onMediaWaiting);
    },
    removeMediaEventsListeners() {
      const media = this._player;

      media.removeEventListener("abort", this.onMediaAbort);
      media.removeEventListener("canplay", this.onMediaCanPlay);
      media.removeEventListener("canplaythrough", this.onMediaCanPlayThrough);
      media.removeEventListener("durationchange", this.onMediaDurationChange);
      media.removeEventListener("emptied", this.onMediaEmptied);
      media.removeEventListener("ended", this.onMediaEnded);
      media.removeEventListener("error", this.onMediaError);
      media.removeEventListener("loadeddata", this.onMediaLoadedData);
      media.removeEventListener("loadedmetadata", this.onMediaLoadedMetadata);
      media.removeEventListener("loadstart", this.onMediaLoadStart);
      media.removeEventListener("pause", this.onMediaPause);
      media.removeEventListener("play", this.onMediaPlay);
      media.removeEventListener("playing", this.onMediaPlaying);
      media.removeEventListener("progress", this.onMediaProgress);
      media.removeEventListener("ratechange", this.onMediaRateChange);
      media.removeEventListener("seeking", this.onMediaSeeking);
      media.removeEventListener("seeked", this.onMediaSeeked);
      media.removeEventListener("stalled", this.onMediaStalled);
      media.removeEventListener("suspend", this.onMediaSuspend);
      media.removeEventListener("timeupdate", this.onMediaTimeUpdate);
      media.removeEventListener("volumechange", this.onMediaVolumeChange);
      media.removeEventListener("waiting", this.onMediaWaiting);
    },
    onMediaAbort() {
      DEBUG_ON && console.log("abort");
      this._mediaEventsHandlers.onMediaAbort && this._mediaEventsHandlers.onMediaAbort();
    },
    onMediaCanPlay() {
      DEBUG_ON && console.log("canplay");
      this._mediaEventsHandlers.onMediaCanPlay && this._mediaEventsHandlers.onMediaCanPlay();
    },
    onMediaCanPlayThrough() {
      DEBUG_ON && console.log("canplaythrough");
      this._mediaEventsHandlers.onMediaCanPlayThrough && this._mediaEventsHandlers.onMediaCanPlayThrough();
    },
    onMediaDurationChange() {
      DEBUG_ON && console.log("durationchange");
      this._mediaEventsHandlers.onMediaDurationChange && this._mediaEventsHandlers.onMediaDurationChange();
    },
    onMediaEmptied() {
      DEBUG_ON && console.log("emptied");
      this._mediaEventsHandlers.onMediaEmptied && this._mediaEventsHandlers.onMediaEmptied();
    },
    onMediaEnded() {
      debugger;
      DEBUG_ON && console.log("ended");
      this._mediaEventsHandlers.onMediaEnded && this._mediaEventsHandlers.onMediaEnded();
    },
    onMediaError() {
      DEBUG_ON && console.log("error");
      this._mediaEventsHandlers.onMediaError && this._mediaEventsHandlers.onMediaError();
    },
    onMediaLoadedData() {
      DEBUG_ON && console.log("loadeddata");
      this._mediaEventsHandlers.onMediaLoadedData && this._mediaEventsHandlers.onMediaLoadedData();
    },
    onMediaLoadedMetadata() {
      DEBUG_ON && console.log("loadedmetadata");
      this._mediaEventsHandlers.onMediaLoadedMetadata && this._mediaEventsHandlers.onMediaLoadedMetadata();
    },
    onMediaLoadStart() {
      DEBUG_ON && console.log("loadstart");
      this._mediaEventsHandlers.onMediaLoadStart && this._mediaEventsHandlers.onMediaLoadStart();
    },
    onMediaPause() {
      DEBUG_ON && console.log("pause");
      this._mediaEventsHandlers.onMediaPause && this._mediaEventsHandlers.onMediaPause();
    },
    onMediaPlay() {
      DEBUG_ON && console.log("play");
      this._mediaEventsHandlers.onMediaPlay && this._mediaEventsHandlers.onMediaPlay();
    },
    onMediaPlaying() {
      DEBUG_ON && console.log("playing");
      this._mediaEventsHandlers.onMediaPlaying && this._mediaEventsHandlers.onMediaPlaying();
    },
    onMediaProgress() {
      DEBUG_ON && console.log("progress");
      this._mediaEventsHandlers.onMediaProgress && this._mediaEventsHandlers.onMediaProgress();
    },
    onMediaRateChange() {
      DEBUG_ON && console.log("ratechange");
      this._mediaEventsHandlers.onMediaRateChange && this._mediaEventsHandlers.onMediaRateChange();
    },
    onMediaSeeked() {
      DEBUG_ON && console.log("seeked");
      this._mediaEventsHandlers.onMediaSeeked && this._mediaEventsHandlers.onMediaSeeked();
    },
    onMediaSeeking() {
      DEBUG_ON && console.log("seeking");
      this._mediaEventsHandlers.onMediaSeeking && this._mediaEventsHandlers.onMediaSeeking();
    },
    onMediaStalled() {
      DEBUG_ON && console.log("stalled");
      this._mediaEventsHandlers.onMediaStalled && this._mediaEventsHandlers.onMediaStalled();
    },
    onMediaSuspend() {
      DEBUG_ON && console.log("suspend");
      this._mediaEventsHandlers.onMediaSuspend && this._mediaEventsHandlers.onMediaSuspend();
    },
    onMediaTimeUpdate() {
      DEBUG_ON && console.log("timeupdate");
      this._mediaEventsHandlers.onMediaTimeUpdate && this._mediaEventsHandlers.onMediaTimeUpdate();
    },
    onMediaVolumeChange() {
      DEBUG_ON && console.log("volumechange");
      this._mediaEventsHandlers.onMediaVolumeChange && this._mediaEventsHandlers.onMediaVolumeChange();
    },
    onMediaWaiting() {
      DEBUG_ON && console.log("waiting");
      this._mediaEventsHandlers.onMediaWaiting && this._mediaEventsHandlers.onMediaWaiting();
    },
    bindMediaEvents() {
      this.onMediaAbort = this.onMediaAbort.bind(this);
      this.onMediaCanPlay = this.onMediaCanPlay.bind(this);
      this.onMediaCanPlayThrough = this.onMediaCanPlayThrough.bind(this);
      this.onMediaDurationChange = this.onMediaDurationChange.bind(this);
      this.onMediaEmptied = this.onMediaEmptied.bind(this);
      this.onMediaEnded = this.onMediaEnded.bind(this);
      this.onMediaError = this.onMediaError.bind(this);
      this.onMediaLoadStart = this.onMediaLoadStart.bind(this);
      this.onMediaLoadedData = this.onMediaLoadedData.bind(this);
      this.onMediaLoadedMetadata = this.onMediaLoadedMetadata.bind(this);
      this.onMediaPause = this.onMediaPause.bind(this);
      this.onMediaPlay = this.onMediaPlay.bind(this);
      this.onMediaPlaying = this.onMediaPlaying.bind(this);
      this.onMediaProgress = this.onMediaProgress.bind(this);
      this.onMediaRateChange = this.onMediaRateChange.bind(this);
      this.onMediaSeeked = this.onMediaSeeked.bind(this);
      this.onMediaSeeking = this.onMediaSeeking.bind(this);
      this.onMediaStalled = this.onMediaStalled.bind(this);
      this.onMediaSuspend = this.onMediaSuspend.bind(this);
      this.onMediaTimeUpdate = this.onMediaTimeUpdate.bind(this);
      this.onMediaVolumeChange = this.onMediaVolumeChange.bind(this);
      this.onMediaWaiting = this.onMediaWaiting.bind(this);
    },
  };
};

export default HTMLPlayerController;
