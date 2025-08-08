import { StudyPlan } from '@/app/global-components/StudyPlan'
import React from 'react'

export default function Pricing() {
  return (
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
            features={[
              "📚 Hablemos de tus metas y hagamos un plan para lograr tu fluidez en inglés",
            ]}
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
  )
}
