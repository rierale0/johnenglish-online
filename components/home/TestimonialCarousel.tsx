import React, { useRef } from "react";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Swiper as SwiperClassType } from "swiper";

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import VideoWithModal from "@/app/global-components/VideoWithModal";

interface Testimonial {
  id: number;
  videoUrl?: string;
  picture: string;
  name: string;
  quote: string;
  position?: string;
  company?: string;
  companyLink?: string;
  linkedin?: string;
  rating?: number;
  containsVideo?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    videoUrl: "https://www.youtube-nocookie.com/embed/37IkMXAuEAc",
    picture: "home/students/wendy.jpg",
    name: "Wendy Escobar",
    quote:
      "John es un gran maestro que hace que aprender inglés sea una experiencia dinámica y enriquecedora. Gracias a su estilo de enseñanza, he notado un progreso significativo en mi habilidad para comunicarme en inglés con confianza.",
    position: "Ingeniera Química",

    companyLink: "https://globaltech.com",
    containsVideo: false,
  },

  {
    id: 2,
    picture: "/home/students/luiscamacho.jpeg",
    name: "Luis Camacho",
    quote: "Excelente profesor, tiene mucha paciencia y dedicación.",
    position: "CEO",
    company: "Camacho Sánchez Logistics",
    companyLink: "https://csl.ec",
    containsVideo: false,
  },

  {
    id: 3,
    videoUrl: "https://www.youtube-nocookie.com/embed/37IkMXAuEAc",
    picture: "home/students/luis.jpg",
    name: "Luis Guillen",
    quote:
      "John se preocupa por el progreso de sus estudiantes y siempre está dispuesto a brindar apoyo adicional cuando es necesario.",
    position: "Integrador de Sistemas",
    company: "Zapping Digital Home",
    companyLink: "https://zappingdh.com/es/",
    containsVideo: false,
  },

  {
    id: 4,
    picture: "/home/students/angie.jpeg",
    name: "Angie",
    quote:
      "Una clase muy dinamica y divertida. John toma el tiempo para comprender tus objetivos.",
    position: "Licenciada en Historia del Arte y Arqueología",
    containsVideo: false,
  },
  {
    id: 5,
    picture: "/home/students/kemnys.jpg",
    name: "Kemnys Da Silva",
    quote:
      "Es un buen profesor, hace un buen trabajo, recibo clases con él y tiene mucha paciencia.",
    containsVideo: false,
  },
  {
    id: 6,
    picture: "/home/students/oliver.jpeg",
    name: "Oliver Márquez",
    quote: "Muy completo e interesado en enseñar, buena metodología.",
    position: "Desarrollador Web Full Stack",
    containsVideo: false,
  },
  {
    id: 7,
    picture: "/home/students/fer.jpg",
    name: "Fernando Márquez",
    quote:
      "Muy paciente, muy bueno explicando y muy dedicado a enseñar, me ayudó mucho.",
    position: "Desarrollador Web Full Stack",
    containsVideo: false,
  },
];

export default function TestimonialCarousel() {
  const swiperRef = useRef<SwiperClassType | null>(null);

  // Función para pausar/reanudar el autoplay cuando se interactúa con videos
  const handleVideoInteraction = (action: "pause" | "resume") => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      if (action === "pause") {
        swiperRef.current.autoplay.stop();
      } else {
        swiperRef.current.autoplay.start();
      }
    }
  };
  return (
    <section className="py-16 testimonial-carousel-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Carousel */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          ref={swiperRef as React.Ref<SwiperRef>}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet-custom",
            bulletActiveClass: "swiper-pagination-bullet-active-custom",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="testimonial-swiper relative z-10"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-white rounded-2xl overflow-hidden mx-4 mb-12 shadow-[8px_8px_0px_0px_#907AD6]">
                <div className="flex flex-col lg:flex-row">
                  {/* Video Section */}
                  <div className="w-full lg:w-1/2 relative">
                    <div
                      className="aspect-square lg:aspect-square bg-gray-100 overflow-hidden"
                      onMouseEnter={() => handleVideoInteraction("pause")}
                      onMouseLeave={() => handleVideoInteraction("resume")}
                      onClick={() => handleVideoInteraction("pause")}
                    >
                      <VideoWithModal
                        picture={testimonial.picture}
                        videoUrl={testimonial.videoUrl ?? ""}
                        containsVideo={testimonial.containsVideo}
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    {/* Quote */}
                    <div className="mb-6">
                      <svg
                        className="w-8 h-8 text-blue-500 mb-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
                                                &quot;{testimonial.quote}&quot;
                      </blockquote>
                    </div>

                    {/* Author Info */}
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="ml-4 text-start">
                            <p className="font-bold text-gray-900 text-lg">
                              {testimonial.name}
                            </p>
                            {testimonial.position && (
                              <p className="text-gray-600 text-sm">
                                {testimonial.position}
                                {testimonial.company && (
                                  <>
                                    {" en "}
                                    {testimonial.companyLink ? (
                                      <a
                                        href={testimonial.companyLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors"
                                      >
                                        {testimonial.company}
                                      </a>
                                    ) : (
                                      <span className="text-blue-600 font-medium">
                                        {testimonial.company}
                                      </span>
                                    )}
                                  </>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <div className="hidden md:block">
            <button className="swiper-button-prev-custom group flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50 absolute top-1/2 -translate-y-1/2 left-[-1.5rem] z-20">
                <svg
                className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                />
                </svg>
            </button>
            <button className="swiper-button-next-custom group flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50 absolute top-1/2 -translate-y-1/2 right-[-1.5rem] z-20">
                <svg
                className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
                </svg>
            </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .testimonial-swiper {
          padding-bottom: 60px !important;
        }

        .testimonial-swiper .swiper-pagination {
          bottom: 20px !important;
        }

        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: #e2e8f0;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active-custom {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          transform: scale(1.2);
        }

        .swiper-button-prev-custom:disabled,
        .swiper-button-next-custom:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Asegurar que el modal se renderice por encima del carousel */
        .video-modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(0, 0, 0, 0.8) !important;
          z-index: 9999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .video-modal-content {
          position: relative !important;
          max-width: 90vw !important;
          max-height: 90vh !important;
          z-index: 10000 !important;
        }

        /* Prevenir scroll del body cuando el modal está abierto */
        body.modal-open {
          overflow: hidden !important;
        }

        /* Styles para el contenedor del carousel */
        .testimonial-carousel-container {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </section>
  );
}
