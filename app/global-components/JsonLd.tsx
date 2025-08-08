"use client";

import { useEffect, useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface JsonLdProps {
  data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render on client-side to avoid hydration mismatch
  if (!mounted) return null;
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  );
}