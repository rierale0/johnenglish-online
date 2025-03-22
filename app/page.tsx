"use client";

import { useState } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { StudyPlan } from "@/components/StudyPlan";
import { ScrollButton } from "@/components/ScrollButton";
import ClassPicker from "@/components/ClassPicker";

export default function Home() {
  const [isClassPickerOpen, setIsClassPickerOpen] = useState(false);
  
  return (
    <main className="min-h-screen bg-[#2C2A4A] text-white flex flex-col gap-8">
      {/* Header Section */}
      <nav className="flex justify-between px-8 md:px-12 lg:px-16 py-6 items-center">
        <h1 className="text-m font-regular">English with John ✨</h1>

        {/* <div className="relative w-10 h-10 md:w-8 md:h-8 rounded-full overflow-hidden cursor-pointer">
          <Image
            src="/placeholder-user.jpg"
            alt="Login Avatar"
            fill
            className="object-cover"
          />
        </div> */}
      </nav>

      {/* Hero Section */}
      <section className="rounded-xl px-8 md:px-12 lg:px-16 py-12 text-center max-w-7xl mx-auto w-full">
        <h1 className="text-2xl md:text-5xl lg:text-4xl font-bold mb-8 w-full">
          🗣️ <span className="text-[#DABFFF]">Speak English</span> with
          <br />
          Confidence and Clarity!
        </h1>

        <div className="relative w-full aspect-[21/9] max-w-md mx-auto mb-8 rounded-xl overflow-hidden shadow-xl">
          <Image
            src="/home/hero-john-students.png"
            alt="English Learning"
            fill
            priority
            className="object-cover"
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

      <div className="bg-[#242239]">
        {/* Profile Section */}
        <section className="py-12 text-center w-full">
          <div className="mx-auto">
            <h2 className="text-3xl lg:text-4xl lg:mb-4 font-bold text-[#FFF9E3] mb-2 px-8 md:px-12">
              I am John,
            </h2>

            <div className="bg-[#3D3F70] p-4 md:p-6 flex items-center justify-center gap-3 md:gap-4 mx-auto">
              <Image
                src="/home/usa-flag.png"
                alt="USA Flag"
                width={24}
                height={24}
                className="md:w-8 md:h-8 lg:w-10 lg:h-10"
              />
              <p className="text-white text-start">
                <span className="font-bold text-lg md:text-xl lg:text-2xl">
                  I love helping students speak
                </span>{" "}
                <br />
                <span className="font-extralight text-md md:text-lg lg:text-xl">
                  with confidence and clarity!
                </span>
              </p>
            </div>

            {/* Teaching All Levels */}
            <div className="mt-4 flex flex-col md:grid md:grid-cols-2 gap-3 mt-14 md:gap-6 px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
              <div className="mx-auto w-full max-w-xl">
                <h3 className="text-xl text-start font-regular text-[#FFF9E3] mt-[22px] mb-4 md:mb-6">
                  📚 Teaching All Levels
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
                      Adults and professionals
                    </span>{" "}
                    <br />
                    <span className="font-thin text-md md:text-lg text-[#DEDEDE]">
                      Personalized lessons to boost careers
                    </span>
                  </p>
                </div>

                <div className="flex items-start gap-3 md:gap-4 mt-4 md:mt-4 md:bg-[#3D3F70]/50 md:p-6 md:rounded-xl md:hover:bg-[#3D3F70] md:transition-all">
                  <Image
                    src="/home/user-female.svg"
                    alt="Kid"
                    width={34}
                    height={34}
                    className="md:w-10 md:h-10"
                  />
                  <p className="text-white text-start">
                    <span className="font-light text-lg md:text-xl">Kids & Teens</span>{" "}
                    <br />
                    <span className="font-thin text-md md:text-lg text-[#DEDEDE]">
                      Engaging classes with fun activities
                    </span>
                  </p>
                </div>
              </div>

              {/* Teaching Methods */}
              <div className="mx-auto w-full max-w-xl">
                <h3 className="text-xl text-start font-regular text-[#FFF9E3] mt-[22px] mb-4 md:mb-6">
                  🎯 Teaching Methods
                </h3>

                <div className="flex items-start gap-3 md:gap-4 md:bg-[#3D3F70]/50 md:p-6 md:rounded-xl md:hover:bg-[#3D3F70] md:transition-all">
                  <Image
                    src="/home/speech-bubble.svg"
                    alt="Conversation"
                    width={34}
                    height={34}
                    className="md:w-10 md:h-10"
                  />
                  <p className="text-white text-start">
                    <span className="font-light text-lg md:text-xl">
                      Conversation Practice
                    </span>{" "}
                    <br />
                    <span className="font-thin text-md md:text-lg text-[#DEDEDE]">
                      Real-world scenarios and daily situations
                    </span>
                  </p>
                </div>

                <div className="flex items-start gap-3 md:gap-4 mt-4 md:mt-4 md:bg-[#3D3F70]/50 md:p-6 md:rounded-xl md:hover:bg-[#3D3F70] md:transition-all">
                  <Image
                    src="/home/for-you.svg"
                    alt="Grammar"
                    width={34}
                    height={34}
                    className="md:w-10 md:h-10"
                  />
                  <p className="text-white text-start">
                    <span className="font-light text-lg md:text-xl">Grammar & Vocabulary</span>{" "}
                    <br />
                    <span className="font-thin text-md md:text-lg text-[#DEDEDE]">
                      Structured learning with practical exercises
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Languages are my passion */}
            <div className="mt-12 px-10 md:px-12 lg:px-16 max-w-4xl mx-auto">
              <h3 className="text-lg lg:text-3xl font-regular text-center text-[#DABFFF] pt-6 pb-4 rounded-xl">
                I understand what it takes to learn English because...
              </h3>
              <h3 className="text-2xl lg:text-3xl font-regular text-center rounded-xl mb-6">
                <span className="text-[#7FDEFF]">&lt;Languages/&gt;</span> are
                my passion
              </h3>
              <p className="text-white text-center text-lg lg:text-2xl">
                <span className="font-light text-[#DEDEDE]">
                  I love Arabic, Chinese, English, French, Italian, Portuguese,
                  Spanish, and JavaScript!
                </span>
              </p>

              <div className="relative w-full h-[50px] mx-auto mt-6">
                <Image
                  src="/home/languages-john.svg"
                  alt="John's Languages"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="rounded-xl px-8 md:px-12 lg:px-16 py-12 text-center max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h3 id="toma-una-demo" className="text-2xl font-bold text-center rounded-xl">
              🆓 Prueba una clase
            </h3>
            <h3 className="text-2xl font-regular text-center rounded-xl mt-2">
              🚀 ¿Listo para avanzar?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
            <StudyPlan
              title="Clase Demo"
              price="Gratuita"
              features={["📊 Cuéntame de ti y elaboremos un plan"]}
              cardBgColor="#907AD6"
              cta="Toma una Clase Demo"
              ctaBgColor="#B47AD6"
              ctaTextColor="white"
              link="https://calendar.app.google/QeYppmPdgYRFVM499"
            />
            <StudyPlan
              title="Una Clase"
              currency="/home/euro.png"
              price="€16/h"
              features={["📚 4 clases por semana", "Total de 16 clases al mes"]}
              cta="Reserva Una Clase"
              ctaTextColor="#242239"
              onClick={() => setIsClassPickerOpen(true)}
            />

            <StudyPlan
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
            />
          </div>
        </section>
      </div>

      <ClassPicker
        isOpen={isClassPickerOpen}
        onClose={() => setIsClassPickerOpen(false)}
      />
    </main>
  );
}