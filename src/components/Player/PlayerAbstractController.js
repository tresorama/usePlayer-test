import LOG from "./utilities/Log";
import { DEBUG_ON } from "./utilities/CONSTANTS";
import HTMLPlayerController from "./HTMLPlayerController";

const PlayerAbstractController = function () {
  return {
    // INSTANCE
    _player: null,
    setPlayerElement(playerElement) {
      const instance = new HTMLPlayerController();
      instance.setPlayer(playerElement);
      this._player = instance;
      this.init();
    },
    init() {
      const instance = this._player;
      instance.setMediaEventsHandlers({
        onMediaEnded: this.onMediaEnded.bind(this),
        onMediaLoadStart: this.onMediaLoadStart.bind(this),
        onMediaSuspend: this.onMediaSuspend.bind(this),
      });
    },
    _callbacks: {},
    setCallbacks(callbacks) {
      if (this._callbacks) {
        this._callbacks = callbacks;
      }
    },
    // PLAYLIST
    isPlaylistMode: false,
    _playlistItems: [],
    _currentPlaylistItemIndex: null,
    loadPlaylist(playlistItems) {
      DEBUG_ON && LOG({ name: "loadPlaylist" });
      this.isPlaylistMode = true;
      this._playlistItems = playlistItems;
      this.loadPlaylistItemByIndex(0);
    },
    loadPlaylistItemByIndex(index) {
      DEBUG_ON && LOG({ name: "loadPlaylistItemByIndex", index });
      const src = this._playlistItems[index].src;
      this._currentPlaylistItemIndex = index;
      this._player.setSource(src);
    },
    playNextPlaylistItem() {
      DEBUG_ON && LOG({ name: "playNextPlaylistItem" });
      const currentIndex = this._currentPlaylistItemIndex;
      const lastIndex = this._playlistItems.length - 1;
      const nextIndex = currentIndex + 1;
      if (nextIndex > lastIndex) {
        // no more items to play, playlist ended.
        return;
      }
      this.loadPlaylistItemByIndex(nextIndex);
      this._player.play();
    },
    playPreviousPlaylistItem() {
      DEBUG_ON && LOG({ name: "playPreviousPlaylistItem" });
      const currentIndex = this._currentPlaylistItemIndex;
      let nextIndex = currentIndex - 1;
      if (nextIndex < 0) nextIndex = 0;
      this.loadPlaylistItemByIndex(nextIndex);
      this._player.play();
    },

    // SUBSCRIBE TO PLAYER EVENT
    onMediaLoadStart() {
      if (this.isPlaylistMode) {
        this._callbacks.onPlaylistItemStarts &&
          this._callbacks.onPlaylistItemStarts(this, this._currentPlaylistItemIndex);
      }
    },
    onMediaEnded() {
      if (this.isPlaylistMode) {
        this._callbacks.onPlaylistItemEnds && this._callbacks.onPlaylistItemEnds(this, this._currentPlaylistItemIndex);
        this.playNextPlaylistItem();
      }
    },
    onMediaSuspend() {
      this._callbacks.onMediaSuspend && this._callbacks.onMediaSuspend(this);
    },

    // DELEGATE TO PLAYER
    play() {
      return this._player.play();
    },
    pause() {
      this._player.pause();
    },
    mute() {
      this._player.setMuted(true);
    },
    unmute() {
      this._player.setMuted(false);
    },
    setVolume(...args) {
      this._player.setVolume(...args);
    },
    setLoop(...args) {
      this._player.setLoop(...args);
    },

    // PLAYER STATUS
    getPlayerStatus() {
      return {
        isPlaying: this._player.isPlaying,
        isMuted: this._player.isMuted,
      };
    },

    // PLAYER ENHANCED METHODS
    async unmutePlayingVideo() {
      // if player NOT was playing ...
      if (!this._player.isPlaying) {
        this.unmute();
      } else {
        // if player was playing ...
        this.unmute();
        // if browserAutomaticallyPausedPlayer
        if (this._player.isPaused) {
          this.mute();
          await this.play();
        }
      }
      return this.getPlayerStatus();
    },
  };
};

export default PlayerAbstractController;
