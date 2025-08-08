import Image from 'next/image'
import React from 'react'

export default function Profile() {
  return (
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
                I&apos;m passionate about{" "}
                <span className="text-[#7FDEFF]">&lt;Languages/&gt;</span>
              </h3>
              <p className="text-[#DEDEDE] font-light text-center text-3xl md:px-12 lg:text-2xl">
                Como aprendiz de idiomas, entiendo perfectamente el proceso y
                puedo ayudarte a alcanzar la fluidez que&nbsp;deseas&nbsp;✨
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
  )
}
