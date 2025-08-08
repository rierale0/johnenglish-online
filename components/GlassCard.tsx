import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ 
  children, 
  className = "" 
}: GlassCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-2xl border border-white/20 ${className}`}>
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}