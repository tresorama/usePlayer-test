import React from "react";

const FullScreenButton = ({ isFullScreenActive, ...props }) => (
  <div className="full-screen-button" {...props}>
    {!isFullScreenActive && "ENABLE fullscreen"}
    {isFullScreenActive && "DISABLE fullscreen"}
  </div>
);

export default FullScreenButton;
