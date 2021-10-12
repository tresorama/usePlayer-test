import { useRef, useEffect } from "react";
import PlayerAbstractController from "./PlayerAbstractController";

const usePlayer = ({ playerRef, playlistItems, playerEventsCallbacks }) => {
  const _PlayerAbstractController = useRef();

  useEffect(() => {
    if (playerRef.current) {
      const instance = new PlayerAbstractController();
      instance.setPlayerElement(playerRef.current);
      _PlayerAbstractController.current = instance;
    }
  }, [playerRef]);

  useEffect(() => {
    if (_PlayerAbstractController.current) {
      const instance = _PlayerAbstractController.current;
      instance.loadPlaylist(playlistItems);
    }
  }, [playlistItems]);

  useEffect(() => {
    if (_PlayerAbstractController.current) {
      const instance = _PlayerAbstractController.current;
      instance.setCallbacks(playerEventsCallbacks);
    }
  }, [playerEventsCallbacks]);

  return [_PlayerAbstractController.current];
};

export default usePlayer;
