import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const VideoPlayer = ({ src, poster, subtitles = [] }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Default Plyr options
    const defaultOptions = {
      captions: { active: true, update: true, language: 'en' },
      quality: {
        default: 1080,
        options: [1080, 720, 480, 360],
      },
      controls: [
        'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 
        'captions', 'settings', 'pip', 'airplay', 'fullscreen'
      ],
    };

    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        hlsRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          playerRef.current = new Plyr(video, defaultOptions);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for Safari
        video.src = src;
        playerRef.current = new Plyr(video, defaultOptions);
      }
    } else {
      // Direct MP4
      video.src = src;
      playerRef.current = new Plyr(video, defaultOptions);
    }

    return () => {
      if (playerRef.current) playerRef.current.destroy();
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [src]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        playsInline
        controls
        poster={poster}
        className="w-full h-full"
      >
        {subtitles.map((sub, index) => (
          <track
            key={index}
            kind="captions"
            label={sub.label || `Language ${index}`}
            srcLang={sub.lang || 'en'}
            src={sub.url}
            default={sub.default}
          />
        ))}
      </video>
    </div>
  );
};

export default VideoPlayer;
