"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

export default function TeacherVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="jf-video-frame">
      {playing ? (
        <iframe
          src="https://www.youtube-nocookie.com/embed/5q5Ul8jzb8o?autoplay=1"
          title="English with John: presentación de John"
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          ref={element => { element?.focus(); }}
        />
      ) : (
        <button className="jf-video-preview" type="button" onClick={() => setPlaying(true)} aria-label="Reproducir la presentación de John, 36 segundos">
          <Image src="/junior-fluency/john-video.jpg" alt="" fill sizes="(max-width: 767px) calc(100vw - 60px), 550px" />
          <span className="jf-video-play"><Play size={26} fill="currentColor" aria-hidden="true" /></span>
        </button>
      )}
    </div>
  );
}
