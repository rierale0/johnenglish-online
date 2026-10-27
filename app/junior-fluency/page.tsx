import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock3, FlaskConical, Gamepad2, Headphones, MessageCircle, NotebookPen, PenLine, SlidersHorizontal, Sparkles, TrendingUp, UsersRound } from "lucide-react";
import Footer from "@/app/global-components/Footer";
import ConsultationLink from "@/components/junior-fluency/ConsultationLink";
import ProgramPricing from "@/components/junior-fluency/ProgramPricing";
import InterestCarousel from "@/components/junior-fluency/InterestCarousel";
import LearningJourney from "@/components/junior-fluency/LearningJourney";
import TeacherVideo from "@/components/junior-fluency/TeacherVideo";
import TestimonialsSection from "@/components/junior-fluency/TestimonialsSection";
import SectionMotion from "@/components/junior-fluency/SectionMotion";
import { juniorWhatsAppUrl } from "@/lib/junior-fluency";
import "./junior-fluency.css";

const title = "Junior Fluency | Clases de inglés online para niños y adolescentes | English with John";
const description = "Clases individuales de inglés online desde los 8 años. Actividades personalizadas, correcciones y seguimiento para familias. Solicita una asesoría gratuita.";
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: "https://inglesconjohn.es/junior-fluency" },
  openGraph: { title, description, url: "https://inglesconjohn.es/junior-fluency", siteName: "English with John", locale: "es_ES", type: "website", images: [{ url: "/junior-fluency/junior-fluency-hero.webp", width: 1536, height: 1024, alt: "Ilustración de cuatro niños conversando junto a un portátil" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/junior-fluency/junior-fluency-hero.webp"] },
};

const benefits = [
  { icon: MessageCircle, label: "Más confianza", note: "Hello!", title: "Que se atreva a hablar inglés", text: "Conversaciones y situaciones a su nivel, con espacio para equivocarse y aprender." },
  { icon: Sparkles, label: "Más motivación", note: "Let's explore!", title: "Que disfrute mientras aprende", text: "Sus aficiones se convierten en actividades para practicar inglés con sentido." },
  { icon: TrendingUp, label: "Más claridad para ti", note: "Paso a paso", title: "Que puedas conocer sus avances", text: "Compartiré contigo sus avances, dificultades y próximos objetivos." },
];
const interests = [
  { icon: Gamepad2, image: "videojuegos-v2", height: 540, alt: "Ilustración de Minecraft con Steve y animales en un paisaje de bloques", title: "Videojuegos", text: "Minecraft y otros videojuegos pueden ayudarnos a practicar descripciones, instrucciones, vocabulario, conversaciones y resolución de problemas en inglés." },
  { icon: FlaskConical, image: "ciencia-v3", height: 640, alt: "Niño con gafas de protección observando un matraz con líquido rosa", title: "Ciencia y tecnología", text: "Podemos explorar curiosidades científicas, aprender vocabulario y practicar explicaciones adaptadas a su nivel." },
  { icon: BookOpen, image: "historias-v2", height: 296, width: 526, alt: "Escena de una aventura animada con una niña, un pato, una rana y una corona flotante", title: "Historias y aventuras", text: "Personajes, historias y situaciones imaginarias nos permiten desarrollar comprensión, lectura, escritura y expresión oral." },
];
const steps = [
  { image: "punto-partida", title: "Conozco su punto de partida", text: "Primero hablamos sobre sus necesidades, objetivos y experiencia previa. Durante las primeras clases observo sus habilidades y dificultades." },
  { image: "practica-idioma", title: "Aprendemos utilizando el idioma", text: "Combinamos conversación, vocabulario, comprensión, gramática, lectura y escritura para que no se limite a memorizar reglas." },
  { image: "refuerzo", title: "Reforzamos lo aprendido", text: "Las actividades personalizadas permiten practicar los contenidos trabajados e incluyen correcciones y explicaciones." },
  { image: "progreso", title: "Revisamos su progreso", text: "Cada cuatro clases preparo una breve revisión para identificar avances, dificultades y los siguientes objetivos." },
];
const includes = [
  { icon: Clock3, text: "Clases individuales online de 60 minutos." },
  { icon: SlidersHorizontal, text: "Contenidos adaptados a su nivel e intereses." },
  { icon: Headphones, text: "Práctica de escucha, habla, lectura y escritura." },
  { icon: PenLine, text: "Correcciones y explicaciones en clase." },
  { icon: NotebookPen, text: "1 actividad personalizada con corrección por cada 2 clases." },
  { icon: TrendingUp, text: "1 revisión de progreso por cada 4 clases." },
  { icon: UsersRound, text: "Información para la familia sobre avances, dificultades y objetivos." },
];
const faqs = [
  ["¿A partir de qué edad puede apuntarse mi hijo?", "Junior Fluency está pensado para niños y adolescentes desde los 8 años. Durante la asesoría inicial podemos valorar si las clases individuales online son adecuadas para su edad, nivel y necesidades."],
  ["¿Necesita tener conocimientos previos de inglés?", "No necesariamente. Podemos trabajar desde niveles iniciales o reforzar conocimientos que ya haya adquirido. Lo importante es conocer su punto de partida y establecer objetivos adecuados."],
  ["¿Las clases son individuales o grupales?", "Todas las clases de Junior Fluency son individuales y se imparten online. Esto me permite adaptar las actividades, explicaciones y ritmo de trabajo a cada estudiante."],
  ["¿Puede ayudarle con el inglés del colegio o instituto?", "Sí. Podemos reforzar contenidos, resolver dudas y practicar las habilidades que le resulten más difíciles. El enfoque también busca ayudarle a utilizar el inglés fuera del aula."],
  ["¿Qué ocurre si no le gustan las clases tradicionales?", "Podemos incorporar videojuegos, historias, actividades creativas y temas que despierten su curiosidad, siempre con objetivos educativos."],
  ["¿Cuántas clases semanales recomiendas?", "Ofrezco programas de una, dos o tres clases semanales. Durante la asesoría podemos valorar cuál es la frecuencia más adecuada según sus objetivos, nivel y disponibilidad."],
  ["¿Cómo sabré si está progresando?", "Cada cuatro clases realizo una revisión del aprendizaje. Compartiré contigo los avances observados, las dificultades que conviene reforzar y los próximos objetivos."],
  ["¿Qué diferencia hay entre el Plan de Inicio y el Programa de Continuidad?", "El Plan de Inicio dura cuatro semanas y cuesta 18 € por sesión. El Programa de Continuidad dura doce semanas y cuesta 16 € por sesión. Ambos incluyen actividades y seguimiento proporcionales al número de clases."],
  ["¿Cómo se realizan los pagos?", "Puedes pagar con tarjeta de crédito o débito mediante Stripe, o mediante Bizum. El programa se abona por adelantado, una vez acordados los horarios y las condiciones de contratación."],
  ["¿Ofreces una clase de prueba gratuita?", "Ofrezco una asesoría inicial gratuita de entre 15 y 20 minutos para madres, padres o tutores. No se trata de una clase completa de prueba, sino de una oportunidad para conocernos antes de empezar."],
];

export default function JuniorFluencyPage() {
  return (
    <div className="jf-page">
      <SectionMotion />
      <a className="jf-skip" href="#junior-contenido">Saltar al contenido</a>
      <main id="junior-contenido">
      <div className="jf-hero-shell">
      <nav className="jf-subnav jf-container" aria-label="Junior Fluency">
        <Link href="/" className="jf-wordmark">Junior Fluency<span>by English with John</span></Link>
        <div><a href="#como-funciona">Cómo funciona</a><a href="#programas">Programas</a><a href={juniorWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="jf-nav-cta">Asesoría gratuita<span className="sr-only"> (WhatsApp, abre en otra pestaña)</span></a></div>
      </nav>
        <section className="jf-hero jf-container" aria-labelledby="junior-title">
          <div className="jf-hero-copy">
            <h1 id="junior-title">Quiero que tu hijo <em className="jf-hero-highlight">gane confianza</em> <span>y disfrute aprendiendo inglés.</span></h1>
            <p className="jf-lead">Clases particulares de inglés online desde los 8 años, adaptadas a su nivel, intereses y forma de aprender.</p>
            <ul className="jf-chips"><li><UsersRound size={14} aria-hidden="true" />Clases 1 a 1</li><li><Clock3 size={14} aria-hidden="true" />De 1 a 3 clases por semana</li><li><TrendingUp size={14} aria-hidden="true" />Progreso acompañado</li></ul>
            <ConsultationLink placement="hero" />
            <p className="jf-microcopy">Una conversación inicial de 15–20 minutos para conocer sus necesidades y resolver tus dudas.</p>
          </div>
          <figure className="jf-hero-art">
            <div className="jf-hero-illustration">
              <Image src="/junior-fluency/junior-fluency-hero.webp" alt="Ilustración de cuatro niños conversando junto a un portátil, con globos que dicen Hi y Let's talk!" width={1536} height={1024} sizes="(max-width: 767px) 290px, 50vw" unoptimized={false} preload />
              <Sparkles className="jf-hero-spark" size={34} strokeWidth={1.5} aria-hidden="true" />
              <span className="jf-hero-language" lang="en"><Image className="jf-hero-flag" src="/home/usa-flag.png" alt="United States flag" width={20} height={20} />English</span>
            </div>
            <figcaption><span aria-hidden="true">✦</span> Sus intereses, nuestro punto de partida.</figcaption>
          </figure>
        </section>
        <div className="jf-wave" aria-hidden="true"><svg viewBox="0 0 1440 150" preserveAspectRatio="none"><path d="M0,32 C360,96 1080,0 1440,80 L1440,150 L0,150 Z" fill="#FFFFFF" /></svg></div>
      </div>
        <section className="jf-section jf-benefits" id="beneficios" aria-labelledby="benefits-title">
          <div className="jf-container">
            <div className="jf-section-heading jf-benefits-heading">
              <div><p className="jf-eyebrow">Aprender inglés puede ser diferente</p><h2 id="benefits-title">Que se sienta cómodo, participe y <span>descubra lo que es capaz de hacer.</span></h2></div>
              <p>Quizá necesita refuerzo, confianza para hablar o recuperar la motivación. Partimos de lo que necesita y de lo que le interesa.</p>
            </div>
            <div className="jf-benefit-grid">{benefits.map(({ icon: Icon, label, note, title, text }) => (
              <article className="jf-benefit-card" key={title}>
                <div className="jf-benefit-art" aria-hidden="true"><span className="jf-icon"><Icon size={36} strokeWidth={1.5} /></span><span className="jf-benefit-note">{note}</span></div>
                <div className="jf-benefit-copy"><p className="jf-benefit-label">{label}</p><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}</div>
          </div>
        </section>
        <section className="jf-section jf-interests" id="intereses" aria-labelledby="interests-title">
          <div className="jf-container">
            <div className="jf-section-heading jf-interests-heading">
              <div className="jf-interests-heading-top">
                <p className="jf-eyebrow">Partimos de lo que le interesa</p>
                <div className="jf-interest-motifs" aria-hidden="true"><span><Gamepad2 size={20} /></span><span><FlaskConical size={20} /></span><span><BookOpen size={20} /></span></div>
              </div>
              <h2 id="interests-title">Sus intereses pueden convertirse en <span>oportunidades para aprender.</span></h2>
              <p className="jf-interests-description">Descubrir qué le gusta nos ayuda a elegir actividades que despierten su curiosidad. Sus intereses son el punto de partida; aprender inglés es siempre el objetivo.</p>
            </div>
            <InterestCarousel>
              {interests.map(({ icon: Icon, image, width = 960, height = 640, alt, title, text }) => (
                <article key={title}>
                  <Image className="jf-interest-image" src={`/junior-fluency/${image}.webp`} alt={alt} width={width} height={height} sizes="(max-width: 767px) calc(100vw - 36px), (max-width: 1023px) 46vw, 380px" loading="lazy" unoptimized={false} />
                  <div className="jf-interest-copy">
                    <div className="jf-interest-heading"><Icon size={20} aria-hidden="true" /><h3>{title}</h3></div>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </InterestCarousel>
          </div>
        </section>
        <section className="jf-section jf-method" id="como-funciona" aria-labelledby="method-title">
          <div className="jf-container">
          <div className="jf-section-heading"><p className="jf-eyebrow">Un aprendizaje pensado para tu hijo</p><h2 id="method-title">Cada estudiante aprende a su manera.</h2><p>En Junior Fluency adapto las clases a las necesidades de cada alumno, prestando atención tanto a sus dificultades como a sus fortalezas.</p></div>
          <LearningJourney>
            {steps.map(({ image, title, text }, index) => (
              <li className="jf-step-card" key={title}>
                <div className="jf-step-visual">
                  <Image src={`/junior-fluency/metodo-${image}-transparente.webp`} alt="" width={480} height={480} sizes="(max-width: 767px) 96px, 148px" loading="lazy" />
                  <span className="jf-step-number" aria-hidden="true">0{index + 1}</span>
                </div>
                <div className="jf-step-copy"><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </LearningJourney>
          <p className="jf-interest-note">No todos los estudiantes tienen que seguir las mismas actividades ni aprender al mismo ritmo. Lo importante es elegir las que mejor respondan a sus necesidades.</p>
          </div>
        </section>
        <section className="jf-section jf-includes" id="que-incluye" aria-labelledby="includes-title">
          <div className="jf-container jf-includes-grid">
            <div className="jf-includes-intro">
              <p className="jf-eyebrow">Mucho más que una clase de inglés</p>
              <h2 id="includes-title">Cada clase forma parte de un <span>proceso de aprendizaje.</span></h2>
              <p>Clases, actividades personalizadas y seguimiento para dar continuidad a su aprendizaje.</p>
              <div className="jf-includes-visual">
                <Image className="jf-includes-image" src="/junior-fluency/acompanamiento-v2.webp" alt="Estudiante recibiendo una clase individual de inglés online y tomando apuntes" width={960} height={640} sizes="(max-width: 767px) 240px, 480px" loading="lazy" unoptimized={false} />
                <span className="jf-includes-symbol" aria-hidden="true"><NotebookPen size={26} strokeWidth={1.5} /></span>
              </div>
            </div>
            <ul className="jf-includes-list">{includes.map(({ icon: Icon, text }) => <li key={text}><span className="jf-includes-icon"><Icon size={20} aria-hidden="true" /></span><span>{text}</span></li>)}</ul>
          </div>
        </section>
        <TestimonialsSection />
        <ProgramPricing />
        <section className="jf-section jf-teacher" id="conoce-a-john" aria-labelledby="teacher-title">
          <div className="jf-container jf-teacher-layout">
            <div className="jf-teacher-intro">
              <div className="jf-teacher-identity">
                <Image className="jf-teacher-avatar" src="/home/john-profpic.jpg" alt="John, profesor de English with John" width={80} height={80} sizes="80px" />
                <div><p className="jf-eyebrow">Tu profesor, en cada clase</p><h2 id="teacher-title">Hola, soy John</h2></div>
              </div>
              <p className="jf-teacher-lead">Llevo más de seis años ayudando a estudiantes a comunicarse en inglés con confianza.</p>
            </div>
            <figure className="jf-teacher-video">
              <TeacherVideo />
            </figure>
            <div className="jf-teacher-details">
              <p>Me gusta descubrir qué le interesa a cada estudiante y cómo aprende. Creo que avanzar empieza por sentirse cómodo para participar, preguntar y equivocarse.</p>
              <ul className="jf-teacher-values">
                <li><UsersRound size={20} aria-hidden="true" /><span><strong>Clases individuales</strong>Las imparto todas personalmente.</span></li>
                <li><Sparkles size={20} aria-hidden="true" /><span><strong>Sus intereses, nuestro punto de partida</strong>Para practicar inglés con curiosidad y sentido.</span></li>
                <li><TrendingUp size={20} aria-hidden="true" /><span><strong>Seguimiento para las familias</strong>Compartimos avances y próximos objetivos.</span></li>
              </ul>
              <a className="jf-teacher-cta" href={juniorWhatsAppUrl} target="_blank" rel="noopener noreferrer" data-junior-cta="teacher">Hablemos de lo que necesita tu hijo<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (Asesoría gratuita por WhatsApp, abre en otra pestaña)</span></a>
            </div>
          </div>
        </section>
        <section className="jf-section jf-faq jf-container" aria-labelledby="faq-title"><div className="jf-section-heading"><p className="jf-eyebrow">Resolvemos tus dudas</p><h2 id="faq-title">Preguntas habituales de las familias</h2></div><div className="jf-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
        <section className="jf-section jf-closing" aria-labelledby="closing-title"><div className="jf-container"><p className="jf-eyebrow">El primer paso es hablar</p><h2 id="closing-title">¿Empezamos a trabajar en su inglés?</h2><p>Podemos tener una conversación gratuita de 15–20 minutos en la que me cuentes cuáles son sus necesidades, qué dificultades encuentra y qué os gustaría conseguir. Te explicaré cómo funciona Junior Fluency y valoraremos qué programa encaja mejor.</p><ConsultationLink placement="closing" /><p className="jf-microcopy">Sin compromiso. La asesoría se realiza con la madre, el padre o el tutor legal.</p></div></section>
      </main>
      <Footer consultationHref={juniorWhatsAppUrl} />
    </div>
  );
}
