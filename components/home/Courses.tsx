import Image from 'next/image';
import React from "react";
import {
  Users,
  Clock,
  Target,
  User,
  Code,
  Baby,
  ArrowRight,
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  features: { icon: React.ElementType; text: string }[];
  level: string;
  img: string;
  link: string;
  color: string;
}

const specializedCourses: Course[] = [
  {
    id: 0,
    title: "One on One Classes",
    features: [
      { icon: Clock, text: "Curso personalizado"},
      { icon: User, text: "Clases individuales" },
      { icon: Target, text: "Desbloquea tu conversación" },
    ],
    level: "All levels",
    img: "/home/courses/individual.png",
    link: "/cursos/individual",
    color: "#3064B2",
  },
 

  {
    id: 1,
    title: "Junior Fluency",
    features: [
      { icon: Clock, text: "2 meses de estudio" },
      { icon: User, text: "Clases individuales" },
      { icon: Baby, text: "Orientado a niños y adolescentes desde los 8 años" },
    ],
    level: "Beginner",
    img: "/home/courses/junior.png",
    link: "/cursos/profesionales",
    color: "#D68C52",
  },
   {
    id: 2,
    title: "Conversation group",
    features: [
      { icon: Clock, text: "2 meses de estudio" },
      { icon: Users, text: "Grupos reducidos (máx. 3)" },
      { icon: Target, text: "Desbloquea tu conversación" },
    ],
    level: "Intermediate",
    img: "/home/courses/conversation.png",
    link: "/cursos/conversation-group",
    color: "#62A2B8",
  },
  {
    id: 3,
    title: "English for devs",
    features: [
      { icon: Clock, text: "3 meses de estudio" },
      { icon: User, text: "Clases individuales" },
      { icon: Code, text: "Orientado a profesionales tech" },
    ],
    level: "Intermediate",
    img: "/home/courses/developers.png",
    link: "/cursos/developers",
    color: "#967DB8",
  },
];

export default function Courses() {
  const handleCourseClick = (course: Course) => {
    const message = `Hola, estoy interesado/a en el curso "${course.title}". Me gustaría recibir más información.`;
    const whatsappUrl = `https://wa.me/34613696839?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDemoClick = () => {
    const whatsappUrl = `https://calendar.app.google/wVEqD41iWddFgbau6`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="w-full relative overflow-hidden">
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
      <div className="container mx-auto px-4 relative z-10 py-44">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.2] font-bold text-[#DABFFF] mb-4">
            Cursos de inglés<br></br>
            <span className="font-semibold text-white">para cada meta</span>
          </h1>
        </div>

        {/* Specialized Courses Section */}
        <div>
          <div className="grid md:grid-cols-4 gap-10 max-w-5xl mx-auto">
            {specializedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white/90 rounded-2xl overflow-hidden relative shadow-[8px_8px_0px_0px] mb-6 hover:shadow-[10px_10px_0px_0px] transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                style={{ boxShadow: `8px 8px 0px 0px ${course.color}` }}
                onClick={() => handleCourseClick(course)}
              >
                <div className="h-42 w-full overflow-hidden">
                  <Image
                    src={course.img}
                    alt={course.title}
                    width={300}
                    height={200}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {course.title}
                  </h3>
                  <span
                    className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit"
                    style={{
                      background: course.color + "33",
                      color: course.color,
                    }}
                  >
                    {course.level}
                  </span>

                  {/* Features List */}
                  <div className="space-y-3 mb-6 flex-grow">
                    {course.features.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: course.color + "20" }}
                          >
                            <IconComponent
                              size={16}
                              style={{ color: course.color }}
                            />
                          </div>
                          <span className="text-gray-700 text-sm">
                            {feature.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className="mt-auto inline-flex items-center justify-center group"
                    style={{ color: course.color }}
                  >
                    Más información
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
            {/* Tarjeta de Clase Demo */}
            <div id="toma-una-demo" className="md:col-span-4 bg-gradient-to-r from-[#7FDEFF] to-[#DABFFF] rounded-2xl p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[8px_8px_0px_0px_#54889B] hover:shadow-[10px_10px_0px_0px_#54889B] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={handleDemoClick}>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-indigo-900 mb-1">✨ Prueba una clase gratuita</h3>
                <p className="text-indigo-800">Agenda una clase demo gratuita de 25 minutos para evaluar tu nivel, resolver tus dudas y definir el plan de estudio perfecto para ti.</p>
              </div>
              <div
                
                className="bg-white text-indigo-900 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-opacity-90 transition-all whitespace-nowrap"
              >
                Agendar Demo
              </div>
            </div>
          </div>
        </div>

       
      </div>

    </section>
  );
}
