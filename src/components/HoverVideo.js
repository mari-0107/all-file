import React, { useState, useRef } from "react";
import Hls from "hls.js";

function HoverVideo({ src, poster }) {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const handleVideo = () => {
    if (Hls.isSupported()) {
      const video = videoRef.current;
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
      hlsRef.current = hls;
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play();
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    handleVideo();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="videoHover">
      {isHovering ? (
        <video ref={videoRef} poster={poster} muted playsInline />
      ) : (
        <img src={poster} alt="Video thumbnail" />
      )}
    </div>
  );
}

export default HoverVideo;