// Verified against the public profiles on 2026-10-26.
// Keep these snapshots manual; visitors must not trigger requests to either platform.
export const juniorReviewSources = {
  classgap: {
    name: "Classgap",
    url: "https://www.classgap.com/es/tutor/john-riera",
    rating: 5,
    reviewCount: 8,
  },
  tusclasesparticulares: {
    name: "Tusclasesparticulares",
    url: "https://www.tusclasesparticulares.com/profesores/john-riera.htm",
    rating: 5,
    reviewCount: 5,
  },
} as const;

// Iryna's full review and identity were supplied by the owner (published as Katy
// on Classgap). Verónica's full review was also supplied by the owner, with
// "a" corrected to "ha" at their request. María's review is an excerpt.
// Editorial context stays outside the quote.
// Confirm the applicable reuse permissions before publishing; see docs/junior-fluency-testimonios.md.
export const juniorTestimonials = [
  {
    author: "Iryna",
    context: "Madre de Katy",
    quote: "Gracias, John, por su trabajo con mi hija. Ella está muy contenta con sus clases y dice que explica muy bien. Aprecio su paciencia y dedicación. ¡Muchas gracias!",
    rating: 5,
    source: juniorReviewSources.classgap,
    featured: true,
  },
  {
    author: "Verónica",
    context: "La primera sesión de sus dos niños",
    quote: "Somos dos niños de 6 y 8 años, hoy ha sido nuestra primera clase y nos ha encantado 😊😊✔",
    rating: 5,
    source: juniorReviewSources.classgap,
    featured: false,
  },
  {
    author: "María",
    context: "Preparación adaptada a cada estudiante",
    quote: "…prepara las clases según tu nivel y gustos",
    rating: 5,
    source: juniorReviewSources.classgap,
    featured: false,
  },
] as const;
