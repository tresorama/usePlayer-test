const Player = ({ type = "video", domRef, ...props }) =>
  type === "video" ? <video {...props} ref={domRef} /> : <audio {...props} ref={domRef} />;

export default Player;
