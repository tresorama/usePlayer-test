## Usage in Vanilla JS

```html
<section id="target-element">I'm the element that go to Fullscreen</section>

<button id="toggle-fs">Go Fullscreen (i am toggler)</button>
<button id="go-fs">Go Fullscreen</button>
<button id="exit-fs">Exit Fullscreen</button>
```

```js
import FullscreenController from "./FullscreenController";

const el = document.querySelector("#target-element");
const myFullscreenController = new FullscreenController();
myFullScreenController.setElement(el);

document.getElementById("go-fs").addEventListener("click", () => myFullScreenController.enableFullscreen());
document.getElementById("exit-fs").addEventListener("click", () => myFullScreenController.disableFullscreen());
document.getElementById("toggle-fs").addEventListener("click", () => myFullScreenController.toggleFullscreen());

myFullscreenController.onFullscreenChange.subscribe((isFullscreen) => {
  const newButtonText = isFullscreen ? "Exit Fullscreen (i am toggler)" : "Exit Fullscreen (i am toggler)";
  document.getElementById("toggle-fs").innerHTML = newButtonText;
});
```

## Usage in React

```js
import useFullscreen from "./useFullscreen";

const MyComponent = () => {
  const elementRef = React.useRef();
  const [isInFullscrenNow, toggleFullscreen, enableFullscreen, disableFullscreen] = useFullscreen(elementRef);
  const togglerButtonText = isInFullscrenNow ? "Exit Fullscreen (i am toggler)" : "Go Fullscreen (i am toggler)";

  return (
    <div>
      {/* ELEMENT TARGET */}
      <section ref={elementRef}>I'm the element that go to Fullscreen</section>
      {/* BUTTONS */}
      <button onClick={toggleFullscreen}>{togglerButtonText}</button>
      <button onClick={enableFullscreen}>Go Fullscreen</button>
      <button onClick={disableFullscreen}>Exit Fullscreen</button>
    </div>
  );
};
```
