import React from 'react';

interface GlassmorphismBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassmorphismBackground({ 
  children, 
  className = "" 
}: GlassmorphismBackgroundProps) {
  return (
    <div className={`min-h-screen relative overflow-hidden ${className}`}>
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>

      {/* Glass Layer */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/5 border border-white/10"></div>

      {/* Grain Texture */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="grain-pattern"
              x="0"
              y="0"
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
            >
              <rect width="4" height="4" fill="transparent" />
              <circle
                cx="0.5"
                cy="0.5"
                r="0.2"
                fill="currentColor"
                className="text-white"
                opacity="0.3"
              />
              <circle
                cx="2.5"
                cy="1.5"
                r="0.15"
                fill="currentColor"
                className="text-white"
                opacity="0.2"
              />
              <circle
                cx="1"
                cy="3"
                r="0.1"
                fill="currentColor"
                className="text-white"
                opacity="0.4"
              />
              <circle
                cx="3"
                cy="2.5"
                r="0.1"
                fill="currentColor"
                className="text-white"
                opacity="0.25"
              />
              <circle
                cx="1.5"
                cy="0.8"
                r="0.08"
                fill="currentColor"
                className="text-white"
                opacity="0.35"
              />
              <circle
                cx="3.2"
                cy="3.8"
                r="0.12"
                fill="currentColor"
                className="text-white"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grain-pattern)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}