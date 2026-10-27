import { ArrowUpRight, Star } from "lucide-react";
import { juniorReviewSources, juniorTestimonials } from "@/lib/junior-testimonials";

export default function TestimonialsSection() {
  return (
    <section className="jf-section jf-testimonials" id="testimonios" aria-labelledby="testimonials-title">
      <div className="jf-container">
        <div className="jf-section-heading">
          <h2 id="testimonials-title">La experiencia de quienes ya han <span>aprendido conmigo</span></h2>
          <p>Cada estudiante es diferente, pero hay algo que siempre busco: que se sienta cómodo, disfrute aprendiendo y avance con confianza. Estas son algunas experiencias compartidas por mis alumnos y sus familias.</p>
        </div>
        <div className="jf-testimonial-grid">
          {juniorTestimonials.map(({ author, context, quote, rating, source, featured }) => (
            <figure className={`jf-testimonial-card${featured ? " jf-testimonial-featured" : ""}`} key={author}>
              <div className="jf-testimonial-stars">
                <span className="sr-only">Valoración: {rating} de 5 estrellas</span>
                {Array.from({ length: rating }, (_, index) => <Star key={index} size={16} fill="currentColor" aria-hidden="true" />)}
              </div>
              <blockquote cite={source.url}><p>«{quote}»</p></blockquote>
              <figcaption>
                <strong>{author}</strong><span>{context}</span>
                <div className="jf-testimonial-source">
                  <span>{source.name}</span>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    Ver opinión en {source.name}<ArrowUpRight size={15} aria-hidden="true" />
                    <span className="sr-only"> de {author} (abre en otra pestaña)</span>
                  </a>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="jf-review-trust">
          <p className="jf-review-ratings">
            {Object.values(juniorReviewSources).map(({ name, url, rating, reviewCount }, index) => (
              <span key={name}>
                {index > 0 && <span className="jf-review-divider" aria-hidden="true">·</span>}
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <strong>{rating}/5</strong> en {name}
                  <span className="sr-only"> ({reviewCount} valoraciones, abre en otra pestaña)</span>
                </a>
              </span>
            ))}
          </p>
          <p>Valoraciones públicas de estudiantes y familias en plataformas independientes.</p>
        </div>
      </div>
    </section>
  );
}
