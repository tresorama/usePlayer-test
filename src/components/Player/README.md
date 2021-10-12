## Usage in Vanilla JS

```js
import PlayerAbstractController from "./PlayerAbstractController";

const playlistItems = [{ src: "/assets/videos/Video.mp4" }, { src: "/assets/videos/Loop.mp4" }];

const myPlayerController = new PlayerAbstractController();
myPlayerController.setPlayerElement(document.querySelector("#my-pl"));
myPlayerController.loadPlaylist(playlistItems);
myPlayerController.setCallbacks({
  onPlaylistItemStarts: (PlayerController, index) => {
    if (index === 0) {
      console.log("Start Playing Item at Index 0 ");
    }
    if (index === 1) {
      PlayerController.setLoop(true); // enable loop
      console.log("Start Playing Item at Index 1 ");
    }
  },
  onPlaylistItemEnds: (PlayerController, index) => {},
  onMediaSuspend: (PlayerController) => {
    console.log("suspended callback runned");
  },
});

document.getElementById("play").addEventListener("click", () => myPlayerController.play());
document.getElementById("pause").addEventListener("click", () => myPlayerController.pause());
document.getElementById("next").addEventListener("click", () => myPlayerController.playNextPlaylistItem());
document.getElementById("prev").addEventListener("click", () => myPlayerController.playPreviousPlaylistItem());
document.getElementById("mute").addEventListener("click", () => myPlayerController.mute());
document.getElementById("unmute").addEventListener("click", () => myPlayerController.unmute());
document.getElementById("set-vol-10").addEventListener("click", () => myPlayerController.setVolume(10));
document.getElementById("set-vol-90").addEventListener("click", () => myPlayerController.setVolume(90));
```

## Usage in React

```js
import { usePlayer, Player } from ".";

const playlistItems = [{ src: "/assets/videos/Video.mp4" }, { src: "/assets/videos/Loop.mp4" }];

const ExampleComponent = (props) => {
  const [labelText, setLabelText] = React.useState("");

  const playerRef = React.useRef();
  const [PlayerController] = usePlayer({
    playerRef,
    playlistItems,
    playerEventsCallbacks: {
      onPlaylistItemStarts: (PlayerController, index) => {
        if (index === 0) {
          setLabelText("Index : 0 ");
        }
        if (index === 1) {
          PlayerController.setLoop(true); // enable loop
          setLabelText("Index : 1 ");
        }
      },
      onPlaylistItemEnds: () => {},
    },
  });

  return (
    <div>
      <Player domRef={playerRef} type="video" className="my-player" />
    </div>
  );
};
```
