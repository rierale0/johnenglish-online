import { ArrowRight, BookOpen, Clock, Star, Trophy, User, Zap } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const levelCourses = [
  {
    id: 1,
    title: "A1 Launch",
    description: "Primeros pasos en inglés",
    features: [
      { icon: Clock, text: "12 semanas" },
      { icon: User, text: "Clases 1:1" },
      { icon: BookOpen, text: "Fundamentos básicos" },
    ],
    level: "Beginner",
    color: "#3D4044",
    img: "/home/courses/a1.png",
    link: "/cursos/basico-a1",
  },
  {
    id: 2,
    title: "A2 Connect",
    description: "Construye tu base sólida",
    features: [
      { icon: Clock, text: "12 semanas" },
      { icon: User, text: "Clases 1:1" },
      { icon: Zap, text: "Vocabulario esencial" },
    ],
    level: "Beginner",
    color: "#549B8E",
    img: "/home/courses/a2.png",
    link: "/cursos/basico-a2",
  },
  {
    id: 3,
    title: "B1 Navigate",
    description: "Desarrolla fluidez",
    features: [
      { icon: Clock, text: "24 semanas" },
      { icon: User, text: "Clases 1:1" },
      { icon: Trophy, text: "Conversación práctica" },
    ],
    level: "Intermediate",
    color: "#54889B",
    img: "/home/courses/b1.png",
    link: "/cursos/intermedio-b1",
  },
  {
    id: 4,
    title: "B2 Refine",
    description: "Domina el idioma",
    features: [
      { icon: Clock, text: "24 semanas" },
      { icon: User, text: "Clases 1:1" },
      { icon: Star, text: "Nivel avanzado" },
    ],
    level: "Intermediate",
    color: "#967DB8",
    img: "/home/courses/b2.png",
    link: "/cursos/intermedio-b2",
  },
  {
    id: 5,
    title: "C1 Master",
    description: "Domina el idioma",
    features: [
      { icon: Clock, text: "24 semanas" },
      { icon: User, text: "Clases 1:1" },
      { icon: Star, text: "Nivel avanzado" },
    ],
    level: "Advanced",
    color: "#A85051",
    img: "/home/courses/c1.png",
    link: "/cursos/avanzado-c1",
  },
];

export default function CEFRCourses() {
  return (
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Clases Individuales por Niveles
          </h2>
          <p className="text-lg text-white/80 text-center mb-12 max-w-2xl mx-auto">
            Progresa paso a paso con cursos estructurados por niveles
            del&nbsp;Marco&nbsp;Común&nbsp;Europeo
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {levelCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white/95 rounded-2xl overflow-hidden relative shadow-[6px_6px_0px_0px] hover:shadow-[8px_8px_0px_0px] transition-all duration-300 hover:-translate-y-1 flex flex-col"
                style={{ boxShadow: `6px 6px 0px 0px ${course.color}` }}
              >
                <div
                  className={`w-full md:overflow-hidden overflow-visible md:pb-0 md:pt-0`}
                  style={{ background: course.color }}
                >
                  <Image
                    src={course.img}
                    alt={course.title}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full md:rounded-none rounded-t-xl rounded-b-none md:w-full md:h-full w-16 h-16 mx-auto"
                    loading="lazy"
                  />
                </div>
                <div className="md:p-6 p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    {course.description}
                  </p>

                  <span
                    className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit mx-auto"
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
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: course.color + "20" }}
                          >
                            <IconComponent
                              size={12}
                              style={{ color: course.color }}
                            />
                          </div>
                          <span className="text-gray-700 text-xs">
                            {feature.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <a
                    href={course.link}
                    className="text-sm mt-auto inline-flex items-center justify-center group"
                    style={{ color: course.color }}
                  >
                    Más información
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
  )
}
