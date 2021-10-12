import React, { useState, useCallback, useEffect, useRef, useReducer } from "react";
import waitFor from "../utilities/waitFor";
import { Player, usePlayer } from "../components/Player";
import useFullscreen from "../hooks/useFullscreen";
import FullScreenButton from "../components/FullScreenButton";

const playlistItems = [{ src: "/assets/videos/Video.mp4" }, { src: "/assets/videos/Loop.mp4", loop: true }];

const initialState = {
  //
  showPlay: false,
  showUnmute: false,
  showFullscreen: false,
  //
  videoIsMuted: true,
  isFullscreenNow: false,
  //
  triggerDoOnceActions: false,
  // // dev only
  // actionQueue: [],
};

const reducer = (state, action) => {
  const { type } = action;

  let newState = {};

  if (type === "is-play-true") {
    newState.triggerDoOnceActions = true;

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
  }
  if (type === "is-fs-false") {
    newState.isFullscreenNow = false;
  }

  // if (type === "player-suspended") {
  // }

  if (Object.keys(newState).length === 0) {
    throw new Error(`This reducer does not support action : ${type}. Maybe it's a typo !!!`);
  }
  // else {
  //   newState.actionQueue = [...state.actionQueue, type ];
  // }

  return { ...state, ...newState };
};

const Home = () => {
  const [isReady, setIsReady] = useState(false);
  const [labelText, setLabelText] = useState("");

  const [state, dispatch] = useReducer(reducer, initialState);
  const onceUnmuteDone = useRef(false);
  const onceFullscreenDone = useRef(false);

  const playerRef = useRef();
  const [PlayerController] = usePlayer({
    playerRef,
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
      // onMediaSuspend:(PlayerController) => {
      //   dispatch({type: "player-suspended"});
      // }
    },
  });

  const bodyRef = useRef(window.document.body);
  const [isInFullscrenNow, toggleFullScreen, enableFullScreen] = useFullscreen(bodyRef);

  /* =================================================== 
        ACTIONS
  =================================================== */
  const doPlay = useCallback(async () => {
    const outcome = await PlayerController.play();
    if (outcome.success) {
      dispatch({ type: "is-play-true" });
    } else {
      dispatch({ type: "is-play-false" });
    }
  }, [PlayerController]);

  const doUnmute = useCallback(async () => {
    PlayerController.unmute();
    const playerStatus = PlayerController.getPlayerStatus();
    if (playerStatus.isMuted) {
      dispatch({ type: "is-muted-true" });
    } else {
      dispatch({ type: "is-muted-false" });
    }
  }, [PlayerController]);

  const doToggleFullscreen = useCallback(async () => {
    await toggleFullScreen();
  }, [toggleFullScreen]);

  React.useEffect(() => {
    if (isInFullscrenNow) {
      dispatch({ type: "is-fs-true" });
    } else {
      dispatch({ type: "is-fs-false" });
    }
  }, [isInFullscrenNow]);

  /* =================================================== 
        ACTIONS TRIED ONCE
  =================================================== */
  const doOnceUnmute = useCallback(async () => {
    if (!onceUnmuteDone.current) {
      onceUnmuteDone.current = true;
      doUnmute();
    }
  }, [doUnmute]);

  const doOnceToggleFullScreen = useCallback(async () => {
    if (!onceFullscreenDone.current) {
      onceFullscreenDone.current = true;
      doToggleFullscreen();
    }
  }, [doToggleFullscreen]);

  React.useEffect(() => {
    if (state.triggerDoOnceActions) {
      doOnceUnmute();
      doOnceToggleFullScreen();
    }
  }, [state.triggerDoOnceActions, doOnceUnmute, doOnceToggleFullScreen]);

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

  /* =================================================== 
        EVENT HANDLERS
  =================================================== */
  // when user clicks on intro heading , start the ANIMATIONS sequence ...
  const onIntroLayerClick = () => doPlay();

  // when Play Fallback is pressed ...
  const onPlayFallbackButtonClick = () => doPlay();

  // when Unmute is pressed ...
  const onUnmuteButtonClick = () => doUnmute();

  // when FullScreen Button is pressed ...
  const onFullscreenButtonClick = () => doToggleFullscreen();

  /* =================================================== 
        RENDER
  =================================================== */

  return (
    <>
      {!isReady && <h1> Not Ready</h1>}

      {/* LABEL */}
      <h1 onClick={onIntroLayerClick}>COSCIENZA INTUITIVA</h1>

      {/* THE VIDEO */}
      <div className="the-video-layer">
        <Player domRef={playerRef} type={"video"} playsInline muted style={{ width: "400px" }} />
      </div>

      {/* PLAY FALLBACK BUTTON */}
      {state.showPlay && (
        <p>
          <button onClick={onPlayFallbackButtonClick}>PLAY FALLBACK</button>
        </p>
      )}

      {/* UNMUTE FALLBACK BUTTON */}
      {state.showUnmute && state.videoIsMuted && (
        <p>
          <button onClick={onUnmuteButtonClick}>UNMUTE</button>
        </p>
      )}

      {/* FULLSCREEN BUTTON */}
      {state.showFullscreen && (
        <FullScreenButton isFullScreenActive={isInFullscrenNow} onClick={onFullscreenButtonClick} />
      )}

      {/* LABEL */}
      <h1>{labelText}</h1>
    </>
  );
};

export default Home;
