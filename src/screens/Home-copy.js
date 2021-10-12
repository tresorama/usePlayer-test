import React, { useState, useCallback, useEffect } from "react";
import usePlayer from "../components/Player";
import useBrowserFullScreenFeature from "../hooks/useBrowserFullScreenFeature";
import FullScreenButton from "../components/FullScreenButton";

const waitFor = (time = 1) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const playlistItems = [{ src: "/assets/videos/Video.mp4" }, { src: "/assets/videos/Loop.mp4", loop: true }];

const reducer = (state, action) => {
  const { type } = action;
  if (type === "play-attempt-error") {
    return { ...state, phase: type, isVisiblePlayFallbackButton: true };
  }
  if (type === "play-attempt-success") {
    return {
      ...state,
      phase: type,
      isVisiblePlayFallbackButton: false,
      isVisibleFullscreenButton: true,
      isVisibleUnmuteButton: true,
    };
  }
  throw new Error(`This reducer does not support action : ${type}. Maybe it's a typo !!!`);
};
const initialState = {
  phase: "base",
  // phase: "play-attempt-success"
  // phase: "play-attempt-error"
  isVisiblePlayFallbackButton: false,
  isVisibleFullscreenButton: false,
  isVisibleUnmuteButton: false,
};

const red = (state, action) => {
  const { type } = action;

  let newState = {};

  if (type === "is-play-true") {
    newState.showPlay = false;
    newState.showUnmute = true;
    newState.showFullscreen = true;
  }
  if (type === "is-play-false") {
    newState.showPlay = true;
    newState.showUnmute = false;
    newState.showFullscreen = false;
  }
  if (type === "is-muted-true") {
    newState.showUnmute = false;
    newState.videoIsMuted = true;
  }
  if (type === "is-muted-false") {
    newState.showUnmute = true;
    newState.videoIsMuted = false;
  }

  if (type === "is-fs-true") {
    newState.isFullscreenNow = true;
    newState.showFullscreen = true;
  }
  if (type === "is-fs-false") {
    newState.isFullscreenNow = false;
    newState.showFullscreen = true;
  }

  return { ...state, ...newState };
};

const Home = () => {
  const [isReady, setIsReady] = useState(false);
  const [labelText, setLabelText] = useState("");

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { isVisiblePlayFallbackButton, isVisibleUnmuteFallbackButton, isVisibleFullscreenButton } = state;
  const onceUnmuteDone = React.useRef(false);
  const [videoIsMuted, setVideoIsMuted] = React.useState(true);
  const onceFullscreenDone = React.useRef(false);

  const [PlayerComponent, PlayerController] = usePlayer({
    type: "video",
    playlistItems,
    playerEventsCallbacks: {
      onPlaylistItemStarts: (PlayerController, index) => {
        if (index === 0) {
          setLabelText("Index : 0 ");
        }
        if (index === 1) {
          PlayerController.setLoop(true);
          setLabelText("Index : 1 ");
        }
      },
      onPlaylistItemEnds: () => {},
    },
    onPlayerSuspended: useCallback(() => {}, []),
  });
  const [isFullScreen, toggleFullScreen, enableFullScreen] = useBrowserFullScreenFeature();

  /* =================================================== 
        ACTIONS
  =================================================== */

  const doPlay = useCallback(async () => {
    console.log("doPlay");
    const outcome = await PlayerController.play();
    if (outcome.success) {
      dispatch({ type: "play-attempt-success" });
    } else {
      dispatch({ type: "play-attempt-error" });
    }
  }, [PlayerController]);

  const doOnceUnmute = useCallback(async () => {
    if (!onceUnmuteDone.current) {
      onceUnmuteDone.current = true;
      await PlayerController.unmutePlayingVideo();
      const playerStatus = PlayerController.getPlayerStatus();
      if (playerStatus.isMuted) {
        dispatch({ type: "unmute-attempt-error" });
      } else {
        dispatch({ type: "unmute-attempt-success" });
      }
    }
  }, [PlayerController]);

  const doOnceFullScreen = useCallback(async () => {
    if (!onceFullscreenDone.current) {
      onceFullscreenDone.current = true;
      debugger;
      const success = await enableFullScreen();
      if (success) {
      }
    }
  }, [enableFullScreen]);

  /* =================================================== 
        EFFECTS => IS READY
  =================================================== */
  // simulate loading page ...
  useEffect(() => {
    waitFor(400).then(() => {
      setIsReady(true);
    });
  }, []);

  // when isReady become true fade in the page
  useEffect(() => {
    if (isReady) {
      waitFor(1000).then(() => {
        doPlay();
      });
    }
  }, [isReady, doPlay]);

  // /* ===================================================
  //       EFFECTS => SEQUENCE PHASES
  // =================================================== */
  useEffect(() => {
    if (state.phase === "play-attempt-error") {
    }
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === "play-attempt-success") {
      doOnceUnmute();
      doOnceFullScreen();
    }
  }, [state.phase, doOnceUnmute, doOnceFullScreen]);

  // useEffect(() => {
  //   if (state.phase === "unmute-attempt-error") {
  //   }
  // }, [state.phase]);

  // useEffect(() => {
  //   if (state.phase === "unmute-attempt-success") {
  //     debugger;
  //   }
  // }, [state.phase]);

  /* =================================================== 
        EVENT HANDLERS
  =================================================== */
  // when user clicks on intro heading , start the ANIMATIONS sequence ...
  const onIntroLayerClick = () => doPlay();

  // when Play Fallback is pressed ...
  const onPlayFallbackButtonClick = () => doPlay();

  // when Unmute is pressed ...
  const onUnmuteButtonClick = () => {
    PlayerController.unmute();
    const playerStatus = PlayerController.getPlayerStatus();
    setVideoIsMuted(playerStatus.isMuted);
  };

  // when FullScreen Button is pressed ...
  const onFullscreenButtonClick = () => toggleFullScreen();

  /* =================================================== 
        RENDER
  =================================================== */

  return (
    <>
      {!isReady && <h1> Not Ready</h1>}

      {/* LABEL */}
      <h1 onClick={onIntroLayerClick}>INTRO</h1>

      {/* THE VIDEO */}
      <div className="the-video-layer">
        <PlayerComponent playsInline muted style={{ width: "400px" }} />
      </div>

      {/* PLAY FALLBACK BUTTON */}
      {isVisiblePlayFallbackButton && (
        <p>
          <button onClick={onPlayFallbackButtonClick}>PLAY</button>
        </p>
      )}

      {/* UNMUTE FALLBACK BUTTON */}
      {isVisibleUnmuteFallbackButton && videoIsMuted && (
        <p>
          <button onClick={onUnmuteButtonClick}>UNMUTE</button>
        </p>
      )}

      {/* FULLSCREEN BUTTON */}
      {isVisibleFullscreenButton && (
        <FullScreenButton isFullScreenActive={isFullScreen} onClick={onFullscreenButtonClick} />
      )}

      {/* LABEL */}
      <h1>{labelText}</h1>
    </>
  );
};

export default Home;
