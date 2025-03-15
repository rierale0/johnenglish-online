import Image from "next/image";
import { Button } from "@/components/ui/button";
import { StudyPlan } from "@/components/StudyPlan";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#2C2A4A] text-white  flex flex-col gap-8">
      {/* Header Section */}
      <nav className="flex justify-between px-8 md:px-12 lg:px-16 py-6 items-center">
        <h1 className="text-m font-regular">
          English with John ✨
        </h1>
        
        <div className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer">
          <Image
            src="/placeholder-user.jpg"
            alt="Login Avatar"
            fill
            className="object-cover"
          />
        </div>
      </nav>


      {/* Hero Section */}
      <section className="rounded-xl px-8 md:px-12 lg:px-16 py-6 text-center max-w-7xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 w-full">
          🗣️ <span className="text-[#DABFFF]">Speak English</span> with
          <br />
          Confidence and Clarity!
        </h1>
        
        <div className="relative w-full aspect-video max-w-4xl mx-auto mb-6 rounded-xl overflow-hidden shadow-xl">
          <Image
            src="/home/hero-john-students.png"
            alt="English Learning"
            fill
            className="object-cover"
          />
        </div>

        <p className="text-xl font-extralight text-gray-300 w-full max-w-2xl mx-auto">
          Domina el inglés con clases prácticas y personalizadas
        </p>

     

        <Button className="mt-6 w-full bg-[#7FDEFF] hover:bg-[#907AD6] hover:text-white text-[#242239] font-bold text-[24px] py-8 px-8">
          Empieza ya
        </Button>

        <div className="flex flex-row gap-4 justify-start mt-6 mb-8">
          <div className="bg-[#3D3F70] rounded-xl p-4 flex flex-col items-start justify-center min-w-[150px]">
            <span className="text-2xl font-bold mb-1 text-left">+6</span>
            <span className="text-xs text-gray-300 text-left">años de experiencia</span>
          </div>
          <div className="bg-[#3D3F70] rounded-xl p-4 flex flex-col items-start justify-center min-w-[150px]">
            <span className="text-2xl font-bold mb-1 text-left">+100</span>
            <span className="text-xs text-gray-300 text-left">estudiantes satisfechos</span>
          </div>
        </div>
        
      </section>
      
<div id="blue-section" className="bg-[#242239]">
      {/* Profile Section */}
      <section className="py-6">
        <h2 className="text-4xl font-bold text-[#FFF9E3] mt-[22px] px-10 md:px-12 lg:px-16">
          I am John,
        </h2>

        <div className="bg-[#3D3F70] p-4 mt-4 flex items-center gap-3 px-10 md:px-12 lg:px-16">
          <Image
            src="/home/usa-flag.png"
            alt="USA Flag"
            width={24}
            height={24}
          />
          <p className="text-white">
            <span className="font-bold">I love helping students speak</span>{" "}
            <span className="font-extralight">with confidence and clarity!</span>
          </p>
        </div>

        {/* Teaching All Levels */}
        <div className="mt-4 flex flex-col gap-3 px-10 md:px-12 lg:px-16">
        <h3 className="text-2xl font-regular text-[#FFF9E3] mt-[22px] md:px-12 lg:px-16">📚 Teaching All Levels</h3>

            {/* Adults and Professionals */}
              <div className="flex items-center gap-3">
                <Image
                  src="/home/briefcase.svg"
                  alt="Briefcase"
                  width={24}
                  height={24}
                />
                <p className="text-white">
                  <span className="font-light">Adults and professionals:</span>{" "}<br></br>
                  <span className="font-thin">Personalized lessons to boost careers 🚀</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Image
                  src="/home/user-female.svg"
                  alt="Kid"
                  width={24}
                  height={24}
                />
                <p className="text-white">
                  <span className="font-light">Kids & Teens:</span>{" "}<br></br>
                  <span className="font-thin">Engaging classes with fun activities 🎨</span>
                </p>
              </div>
        </div>
        {/* Languages are my passion */}
        <div className="mt-8 px-10 md:px-12 lg:px-16">
          <h3 className="text-xl font-regular text-center text-[#DABFFF] pt-6 pb-4 rounded-xl">
            I understand what it takes to learn English because...
          </h3>
          <h3 className="text-2xl font-regular text-center rounded-xl">
            <span className="text-[#7FDEFF]">&lt;Languages/&gt;</span> are my passion
          </h3>
          <p className="text-white text-center">
                  <span className="font-light">I love Arabic, Chinese, English, French, Italian, Portuguese, Spanish, and JavaScript!</span>
                </p>

                <div className="relative w-full h-[35px] mx-auto mt-6">
                  <Image
                    src="/home/languages-john.svg"
                    alt="John's Languages"
                    fill
                    className="object-contain"
                  />
                </div>
        </div>

         
      </section>
  
      {/* Pricing Section */}
      <section className="rounded-xl px-8 md:px-12 lg:px-16 py-6 text-center max-w-7xl mx-auto w-full flex flex-col items-center">
        <h3 className="text-2xl font-regular text-center rounded-xl py-6">🆓 Prueba una clase</h3>
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
          <StudyPlan
            title="Clase Demo"
            price="Gratuita"
            features={[
              "📊 Cuéntame de ti y elaboremos un plan",
            ]}
            cta="Toma una Clase Demo"
            ctaBgColor="#3D3F70"
            ctaTextColor="white"
          />

<h3 className="text-2xl font-regular text-center rounded-xl pt-6">🚀 ¿Listo para avanzar?</h3>
          <StudyPlan
            title="Una Clase"
            currency="/home/euro.png"
            price="€16/h"
            features={[
              "📚 4 clases por semana",
              "Total de 16 clases al mes"
            ]}
            cta="Suscríbete a Plan Mensual"
          />

          <StudyPlan
            title="Plan Mensual"
            currency="/home/euro.png"
            price="€14/h"
            features={[
              "Suscripción mensual de €224",
              "📚 4 clases por semana",
              "Total de 16 clases al mes"
            ]}
            cta="Suscríbete a Plan Mensual"
            discount="AHORRAS €96"
          />

          <StudyPlan
            title="Plan 3 Meses"
            currency="/home/euro.png"
            price="€12/h"
            features={[
              "Suscripción trimestral de €576",
              "🚀 Alcanza el siguiente nivel de inglés",
              "📅 Define tu horario",
              "📚 4 clases por semana",
              "Total de 48 clases en meses"
            ]}
            cta="Suscríbete a Plan Mensual"
            discount="AHORRAS €96"
          />
        </div>
      </section>
      
      </div>
    </main>
  );
}