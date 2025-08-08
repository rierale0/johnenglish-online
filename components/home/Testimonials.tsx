import React from "react";
import TestimonialCarousel from "./TestimonialCarousel";
import SplitText from "@/components/reactbits/TextAnimations/SplitText/SplitText";

export default function Testimonials() {
  return (
    <section className="w-full min-h-screen relative overflow-hidden text-[#333333] pb-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="diagonal-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              {/* Diagonal lines creating diamond/cross pattern */}
              <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1" className="text-gray-300" />
              <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="1" className="text-gray-300" />
              <line x1="0" y1="0" x2="40" y2="40" stroke="currentColor" strokeWidth="1" className="text-gray-300" />
              <line x1="0" y1="40" x2="40" y2="0" stroke="currentColor" strokeWidth="1" className="text-gray-300" />
              
              {/* Additional finer lines for texture */}
              <line x1="10" y1="0" x2="10" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-gray-200" />
              <line x1="30" y1="0" x2="30" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-gray-200" />
              <line x1="0" y1="10" x2="40" y2="10" stroke="currentColor" strokeWidth="0.5" className="text-gray-200" />
              <line x1="0" y1="30" x2="40" y2="30" stroke="currentColor" strokeWidth="0.5" className="text-gray-200" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-pattern)" />
        </svg>
      </div>

      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20" />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 right-16 w-48 h-48 bg-gradient-to-br from-purple-100/20 to-pink-100/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-br from-yellow-100/25 to-orange-100/25 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}} />

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="items-center max-w-5xl mx-auto min-h-[calc(100vh-2rem)] pt-52">
          <SplitText
            text="✨ Lo que dicen mis estudiantes"
            className="text-xl lg:text-5xl font-semibold text-center"
            delay={30}
            duration={0.4}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="start"
          />
          <TestimonialCarousel />
        </div>
      </div>

    </section>
  );
}