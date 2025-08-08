"use client";

import Footer from "./global-components/Footer";
import Hero from "@/components/home/Hero";
import Testimonials from "@/components/home/Testimonials";
import Courses from "@/components/home/Courses";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <Hero/>
      
      {/* Testimonial Section */}
      <Testimonials/>


      <Courses/>
      

      {/* Chatbot 

      <Chatbot
        logoPath="home\eve-profpic-rounded.png"
        companyName="Eve"
        title="¿Cómo puedo ayudarte hoy?"
        subtitle="Chatea conmigo"
        primaryColor="#4F518C"
        ctaText="✨ Quiero una clase gratuita"
      />
      
      */}

      {/* Footer */}

      <Footer />
    </main>
  );
}
