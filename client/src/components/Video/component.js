import React from "react";
import VideoJS from './videoJS';

export default function Video ({src}) {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: src,
    }]
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  };
  
  return (
    <div>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  );
}
