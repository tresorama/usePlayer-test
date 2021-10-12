import { useState, useEffect, useCallback, useRef } from "react";
import FullscreenController from "./FullscreenController";

const useFullscreen = (domNodeRef) => {
  const _FullScreenController = useRef();
  const [isFullScreen, setIsFullScreen] = useState();

  useEffect(() => {
    // create a new controller
    const el = domNodeRef.current;
    const instance = new FullscreenController();
    instance.setElement(el);
    instance.onFullscreenChange.subscribe(setIsFullScreen);

    // set current state
    const currentState = instance.isInFullscreenNow;
    setIsFullScreen(currentState);

    // save ref of controller
    _FullScreenController.current = instance;

    return () => {
      instance.destroy();
    };
  }, [domNodeRef]);

  const enableFS = useCallback(async () => {
    return await _FullScreenController.current.enableFullscreen();
  }, []);
  const disableFS = useCallback(async () => {
    return await _FullScreenController.current.disableFullscreen();
  }, []);
  const toggleFS = useCallback(async () => {
    return await _FullScreenController.current.toggleFullscreen();
  }, []);

  return [isFullScreen, toggleFS, enableFS, disableFS];
};

export default useFullscreen;
