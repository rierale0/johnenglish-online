"use client";

import { useEffect } from 'react';

export default function FacebookPixel({ pixelId }: { pixelId: string }) {
  useEffect(() => {
    // Initialize Facebook Pixel
    if (!window.fbq) {
      window.fbq = function(...args: any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (window.fbq.callMethod) {
          window.fbq.callMethod(...args);
        } else {
          window.fbq.queue.push(args);
        }
      };
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = '2.0';
      window.fbq.queue = [];
      const t = document.createElement('script');
      t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const s = document.getElementsByTagName('script')[0];
      s.parentNode?.insertBefore(t, s);
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