import { useRef, useImperativeHandle, forwardRef } from 'react';
import MyReactPlayer from './myreactplayer';

const PlayerWrapper = forwardRef(({ url, width, height, controls, autoPlay, isPlaying, setIsPlaying, index }, ref) => {
  const playerRef = useRef();

  useImperativeHandle(ref, () => ({
    get currentTime() {
      return playerRef.current?.getInternalPlayer()?.getCurrentTime() || 0;
    },
    set currentTime(value) {
      playerRef.current?.getInternalPlayer()?.seekTo(value);
    },
    get duration() {
      return playerRef.current?.getInternalPlayer()?.getDuration() || 0;
    },
    addEventListener(event, handler) {
      if (event === 'timeupdate') {
        const intervalId = setInterval(() => {
          if (playerRef.current?.getInternalPlayer()?.getPlayerState() === 1) { // Playing
            handler();
          }
        }, 250);
        this.timeUpdateIntervalId = intervalId;
      } else if (event === 'loadedmetadata') {
        playerRef.current?.getInternalPlayer()?.addEventListener('onReady', handler);
      }
    },
    removeEventListener(event, handler) {
      if (event === 'timeupdate') {
        clearInterval(this.timeUpdateIntervalId);
      } else if (event === 'loadedmetadata') {
        playerRef.current?.getInternalPlayer()?.removeEventListener('onReady', handler);
      }
    },
  }));

  return (
    <MyReactPlayer
      ref={playerRef}
      url={url}
      width={width}
      height={height}
      controls={controls}
      autoPlay={autoPlay}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      index={index}
    />
  );
});

export default PlayerWrapper;