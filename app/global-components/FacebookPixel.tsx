"use client";

import { useEffect } from 'react';

export default function FacebookPixel({ pixelId }: { pixelId: string }) {
  useEffect(() => {
    if (!/^\d+$/.test(pixelId)) return;

    if (!window.fbq) {
      function pixel(...args: FacebookPixelArguments) {
        if (window.fbq?.callMethod) {
          window.fbq.callMethod(...args);
        } else {
          pixel.queue.push(args);
        }
      }
      pixel.push = pixel;
      pixel.loaded = true;
      pixel.version = '2.0';
      pixel.queue = [] as FacebookPixelArguments[];
      window.fbq = pixel;
      window._fbq = pixel;
      const t = document.createElement('script');
      t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(t);
    }
    
    // Initialize with your pixel ID
    if (window.fbq) {
      window.fbq('init', pixelId);
      
      // Track PageView on component mount
      window.fbq('track', 'PageView');
    }
    
    // Clean up
    return () => {
      // Clean up event listeners if needed
    };
  }, [pixelId]);

  return null;
}
