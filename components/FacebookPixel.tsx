"use client";

import { useEffect } from 'react';

export default function FacebookPixel({ pixelId }: { pixelId: string }) {
  useEffect(() => {
    // Initialize Facebook Pixel
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    // Initialize with your pixel ID
    fbq('init', pixelId);
    
    // Track PageView on component mount
    fbq('track', 'PageView');
    
    // Track PageView on route change
    const handleRouteChange = () => {
      fbq('track', 'PageView');
    };

    // Clean up
    return () => {
      // Clean up event listeners if needed
    };
  }, [pixelId]);

  return null;
}