"use client";

import { useEffect, useRef } from "react";

interface VideoBackgroundProps {
  src: string;
  poster?: string;
}

export default function VideoBackground({ src, poster }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Autoplay was prevented
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Video element */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Dark overlay with gradient for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              rgba(7, 10, 7, 0.6) 0%,
              rgba(7, 10, 7, 0.4) 30%,
              rgba(7, 10, 7, 0.5) 70%,
              rgba(7, 10, 7, 0.9) 100%
            )
          `,
        }}
      />

      {/* Moss green color overlay for brand consistency */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(74, 124, 74, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 100% 50%, rgba(48, 79, 48, 0.1) 0%, transparent 40%),
            radial-gradient(ellipse 50% 30% at 0% 80%, rgba(58, 99, 58, 0.08) 0%, transparent 40%)
          `,
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(7, 10, 7, 0.4) 100%)",
        }}
      />
    </div>
  );
}
