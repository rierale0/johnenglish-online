
import VideoWithModal from "@/app/global-components/VideoWithModal";
import React from "react";
import ReactCountryFlag from "react-country-flag";

export default function Hero() {
  return (
    <section className="w-full relative overflow-hidden pb-20">
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

      {/* Floating Glass Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-indigo-400/15 to-purple-500/15 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.4]">
                <span className="flex gap-4 text-[#DABFFF] block mb-4 font-bold">
                  Speak English
                </span>
                <span className="text-white block mb-4">with John!</span>
              </h1>

              <p className="text-[1em] font-light text-gray-300 max-w-lg">
                <ReactCountryFlag
                  countryCode="US"
                  svg
                  style={{
                    width: "1em",
                    height: "1em",
                    marginRight: "0.5em",
                  }}
                  title="United States"
                />
                Te ayudaré a perfeccionar tu inglés con clases prácticas y
                personalizadas, para que puedas comunicarte con confianza.
              </p>
            </div>

            {/* CTA Button */}
            <a
              href="https://api.whatsapp.com/send/?phone=34613696839&text=Hola%2C+me+gustar%C3%ADa+tomar+una+clase+demo+gratis.+%C2%BFCu%C3%A1ndo+podr%C3%ADamos+agendarla%3F&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#7FDEFF] text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors"
            >
              Prueba tu primera clase gratis
            </a>
          </div>

          {/* Right Column - Video */}
          <div className="relative aspect-square">
            <VideoWithModal
              picture={"/home/hero-john-students-collage-5.png"}
              videoUrl={
                "https://www.youtube-nocookie.com/embed/5q5Ul8jzb8o?modestbranding=1&rel=0&showinfo=0"
              }
            />

            {/* Video Accent Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#7FDEFF] rounded-full opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#DABFFF] rounded-full opacity-40"></div>
          </div>
        </div>
      </div>
      {/* Onda de transición inferior */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          className="w-full h-[100px]"
        >
          <path
            d="M0,32 C360,96 1080,0 1440,80 L1440,150 L0,150 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  );
}
