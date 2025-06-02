"use client";

import Image from "next/image";
import { StudyPlan } from "@/app/global-components/StudyPlan";
import { ScrollButton } from "@/app/global-components/ScrollButton";
import Header from "./global-components/Header";
import Chatbot from "./global-components/Chatbot";
import Footer from "./global-components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen text-white flex flex-col gap-8">
      {/* Header Section */}
      <Header />
      {/* Hero Section */}
      <section className="rounded-xl px-8 md:px-12 lg:px-16 py-12 text-center max-w-7xl mx-auto w-full">
        {/* Global styles for emoji support */}

        {/* Background with gradient, dots and grain effect */}
        <div className="fixed inset-0 w-full h-full -z-10 bg-gradient-to-b from-[#1A1832] via-[#242239] to-[#1A1832] overflow-hidden">
          {/* Grain overlay */}
          <div className="absolute inset-0 opacity-15 bg-noise"></div>
        </div>

        <style jsx global>{`
          .animation-delay-300 {
            animation-delay: 300ms;
          }
          .animation-delay-600 {
            animation-delay: 600ms;
          }

          /* Grain effect */
          .bg-noise {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            background-repeat: repeat;
            background-size: 200px 200px;
          }
        `}</style>

        <h1 className="text-2xl md:text-5xl lg:text-4xl font-bold mb-8 w-full">
          🗣️ <span className="text-[#DABFFF]">Speak English </span> with
          <br />
          Confidence and Clarity!
        </h1>

        <div className="relative w-full max-w-[560px] aspect-video mx-auto mb-8 rounded-xl overflow-hidden shadow-xl">
          <iframe
            src="https://www.youtube-nocookie.com/embed/5q5Ul8jzb8o?modestbranding=1&rel=0&showinfo=0"
            width="560"
            height="315"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full border-0"
          />
        </div>

        <p className="text-lg md:text-2xl font-extralight text-gray-300 w-full max-w-md mx-auto">
          ✨ Domina el inglés con clases prácticas y personalizadas
        </p>

        <ScrollButton bgColor="#7FDEFF" link="toma-una-demo" />

        <div className="flex flex-row gap-2 mt-6 mb-8 w-full max-w-md mx-auto justify-start">
          <div className="bg-[#3D3F70] rounded-xl p-4 flex flex-col items-start justify-center min-w-[150px]">
            <span className="text-xl font-bold mb-1 text-left relative z-10">
              +6
            </span>
            <span className="text-[12px] text-gray-300 text-left relative z-10">
              años de experiencia
            </span>
          </div>
          <div className="bg-[#3D3F70] rounded-xl p-4 flex flex-col items-start justify-center min-w-[100px]">
            <span className="text-xl font-bold mb-1 text-left">+200</span>
            <span className="text-[12px] text-gray-300 text-left">
              estudiantes satisfechos
            </span>
          </div>
        </div>
      </section>

      <div>
        {/* Profile Section */}
        <section className="py-12 text-center w-full">
          <div className="mx-auto">
            <div className="flex items-center gap-4 justify-center">
              <div className="relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border">
                <Image
                  src="/home/john-profpic.jpg"
                  alt="John's Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left text-3xl lg:text-4xl lg:mb-4 font-bold text-[#FFF9E3] flex flex-col gap-1">
                <span>I am John, </span>
                <span className="text-[#7FDEFF] text-xl font-light">
                  English Teacher
                </span>
              </div>
            </div>

            <div className="relative p-6 md:p-8 mx-auto max-w-2xl">
              {/* Speech bubble container */}
              <div className="bg-[#3D3F70] rounded-2xl p-6 relative">
                {/* Animated dots for speech bubble */}
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#7FDEFF] animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-[#DABFFF] animate-pulse animation-delay-300"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7FDEFF] animate-pulse animation-delay-600"></div>
                </div>

                <div className="flex items-center gap-4">
                  <Image
                    src="/home/usa-flag.png"
                    alt="USA Flag"
                    width={24}
                    height={24}
                    className="md:w-8 md:h-8 lg:w-10 lg:h-10"
                  />
                  <div className="text-white text-left">
                    <p className="font-regular italic text-lg md:text-xl lg:text-2xl">
                      Me encanta ayudar a los estudiantes a hablar{" "}
                      <span className="text-[#7FDEFF]">
                        con confianza y claridad!
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <style jsx global>{`
              .animation-delay-300 {
                animation-delay: 300ms;
              }
              .animation-delay-600 {
                animation-delay: 600ms;
              }
            `}</style>

            {/* Teaching All Levels */}
            <div className="mt-4 flex flex-col gap-3 mt-14 md:gap-6 px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
              <div className="mx-auto w-full max-w-xl">
                <h3 className="text-2xl text-start font-bold text-[#FFF9E3] mt-[22px] mb-4 md:mb-6">
                  📚 Para todos los niveles
                </h3>

                {/* Adults and Professionals */}
                <div className="flex items-start gap-3 md:gap-4 md:bg-[#3D3F70]/50 md:p-6 md:rounded-xl md:hover:bg-[#3D3F70] md:transition-all">
                  <Image
                    src="/home/briefcase.svg"
                    alt="Briefcase"
                    width={34}
                    height={34}
                    className="md:w-10 md:h-10"
                  />
                  <p className="text-white text-start">
                    <span className="font-light text-lg md:text-xl">
                      Adultos y profesionales:
                    </span>{" "}
                    <br />
                    <span className="font-thin text-md md:text-lg text-[#DEDEDE]">
                      Clases personalizadas para impulsar carreras
                    </span>
                  </p>
                </div>

                {/* Kids */}
                <div className="flex items-start gap-3 md:gap-4 mt-4 md:mt-4 md:bg-[#3D3F70]/50 md:p-6 md:rounded-xl md:hover:bg-[#3D3F70] md:transition-all">
                  <Image
                    src="/home/user-female.svg"
                    alt="Kid"
                    width={34}
                    height={34}
                    className="md:w-10 md:h-10"
                  />
                  <p className="text-white text-start">
                    <span className="font-light text-lg md:text-xl">
                      Niños y adolescentes:
                    </span>{" "}
                    <br />
                    <span className="font-thin text-md md:text-lg text-[#DEDEDE]">
                      Clases dinámicas con actividades divertidas
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto border-t border-gray-600 my-[6em]" />

            {/* Languages are my passion */}
            <div className="mt-12 px-10 md:px-12 lg:px-16 max-w-4xl mx-auto">
              <h3 className="text-2xl lg:text-3xl font-regular text-center rounded-xl mb-6">
                I'm passionate about <span className="text-[#7FDEFF]">&lt;Languages/&gt;</span>
              </h3>
              <p className="text-[#DEDEDE] font-light text-center text-3xl md:px-12 lg:text-2xl">
                  Como aprendiz de idiomas, entiendo perfectamente el proceso y puedo ayudarte a alcanzar la fluidez que&nbsp;deseas&nbsp;✨
              </p>

              <div className="relative w-full h-[50px] mx-auto mt-6">
                <Image
                  src="/home/languages-john.svg"
                  alt="Idiomas de John"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-8 md:px-12 lg:px-16 py-12 text-center max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
          <h3
            id="toma-una-demo"
            className="text-2xl md:text-4xl font-bold text-center rounded-xl mb-8"
          >
            Prueba una clase
          </h3>

          <StudyPlan
            title="✨ Clase Demo"
            price="€0"
            features={["📚 Hablemos de tus metas y hagamos un plan para lograr tu fluidez en inglés"]}
            cardBgColor="#907AD6"
            cta="Toma una clase demo"
            ctaBgColor="#B47AD6"
            ctaTextColor="white"
            glow={true}
            link="https://calendar.app.google/5imfJ6mN6wJvHq4E8"
          />

          {/*
          <h3
            id="toma-una-demo"
            className="text-2xl md:text-4xl font-bold text-center rounded-xl mb-8 mt-8"
          >
            🚀 ¿Listo para avanzar?
          </h3>

          
          <StudyPlan
            title="Una clase"
            currency="/home/euro.png"
            price="€16/h"
            features={[
              "⏳ Horarios flexibles que se adaptan a ti",
              "💰 Descuentos al reservar más de 5 clases", 
              "🚀 Avanza rápido con un plan a tu medida",
            ]}
            cta="Toma una clase"
            ctaTextColor="#242239"
            link="/schedule-a-class"
          />

          */}

          {/* <StudyPlan
              title="Plan Mensual"
              currency="/home/euro.png"
              price="€14/h"
              features={[
                "Suscripción mensual de €224",
                "📚 4 clases por semana",
                "Total de 16 clases al mes",
              ]}
              cta="Suscríbete al Plan Mensual"
              discount="AHORRAS €96"
              cardBgColor="#2F2B64"
            />

            <StudyPlan
              title="Plan 3 Meses"
              currency="/home/euro.png"
              cardBgColor="#3D6990"
              price="€12/h"
              features={[
                "Suscripción trimestral de €576",
                "🚀 Alcanza el siguiente nivel de inglés",
                "📅 Define tu horario",
                "📚 4 clases por semana",
                "Total de 48 clases en 3 meses",
              ]}
              cta="Suscríbete al Plan Trimestral"
              discount="AHORRAS €192"
            /> */}
        </section>
      </div>

      {/* Chatbot */}

      <Chatbot
        logoPath="home\eve-profpic-rounded.png"
        companyName="Eve"
        title="¿Cómo puedo ayudarte hoy?"
        subtitle="Chatea conmigo"
        primaryColor="#4F518C"
        ctaText="✨ Quiero una clase gratuita"
      />

      {/* Footer */}

      <Footer />
    </main>
  );
}
