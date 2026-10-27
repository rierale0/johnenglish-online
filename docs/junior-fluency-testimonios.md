# Testimonios de Junior Fluency

Verificación de contenido: 26 de octubre de 2026.

- [Classgap](https://www.classgap.com/es/tutor/john-riera): 5,0/5, 8 valoraciones; las tres opiniones seleccionadas muestran cinco estrellas.
- [Tusclasesparticulares](https://www.tusclasesparticulares.com/profesores/john-riera.htm): 5/5, 5 valoraciones.
- Iryna, madre de Katy: el propietario aclara la identidad de la madre y facilita el comentario completo para sustituir el extracto. En Classgap la reseña figura bajo el nombre Katy. Su tarjeta aparece primero y tiene un fondo lavanda discreto.
- Verónica describe únicamente la primera sesión de sus dos niños, de 6 y 8 años. A petición del propietario se reproduce el comentario completo, incluidos los emojis, corrigiendo únicamente el error ortográfico «a» por «ha». No acredita progreso prolongado ni cambia la oferta de Junior Fluency desde los 8 años.
- María destaca la preparación según nivel y preferencias. No se atribuye a esta autora una relación familiar ni una edad que no consten en su reseña.

Los comentarios de Iryna y Verónica se reproducen completos según los textos facilitados por el propietario, con la corrección ortográfica de Verónica indicada arriba. La reseña de María usa un extracto; la elipsis indica la omisión inicial. Los textos de contexto aparecen fuera de las citas. No se añaden fechas de reseña, fotos, resultados académicos ni un total de personas únicas. Las puntuaciones corresponden a los perfiles del profesor y las plataformas se identifican exclusivamente como fuentes.

## Mantenimiento

`lib/junior-testimonials.ts` contiene los extractos, autores, contextos y las puntuaciones y cantidades verificadas. Las reseñas son estáticas, sin solicitudes a las plataformas desde el navegador. Actualizar los datos y esta fecha después de una nueva comprobación de los perfiles.

`TestimonialsSection` se renderiza en el servidor y se inserta entre el acompañamiento y `ProgramPricing`. Reutiliza el contenedor, tipografía, colores, bordes, sombras y espaciado de la landing. Escritorio: tres columnas; tableta: Iryna arriba y las otras dos tarjetas debajo; móvil: una columna. Todos los enlaces externos identifican la nueva pestaña y usan `noopener noreferrer`.

## Publicación

El contenido público permite comprobar los textos y puntuaciones, pero no acredita por sí solo las autorizaciones de reutilización. Confirmar con el titular las autorizaciones aplicables antes de publicar. El enlace público a los términos de Classgap devolvió una página de error durante la consulta, por lo que no se da por verificado un permiso de la plataforma. Esta entrega modifica el código local; no despliega la landing.

## Validación de la integración inicial de testimonios

La revisión posterior de la sección de programas y precios se documenta en [junior-fluency-programas.md](junior-fluency-programas.md). Las comprobaciones siguientes corresponden a la entrega inicial de testimonios.

- `npm run lint`, `npm run typecheck`, `npm test` (9 pruebas) y `npm run build`: aprobados. La landing se genera como página estática.
- Chrome sobre el build de producción: 320, 360, 393, 430, 768, 1024 y 1440 px; sin desbordamiento horizontal ni errores de consola. Capturas revisadas visualmente en móvil, tableta y escritorio.
- Texto al 200% a 320 px: la sección se adapta sin desbordamiento. Se corrigió el salto de palabras en el título y en el nombre largo de la plataforma.
- Orden de secciones, tres autores, cinco estrellas por tarjeta, citas semánticas y cinco enlaces externos: comprobados. Navegación al perfil original mediante teclado, foco visible y nueva pestaña: comprobados con la navegación interceptada localmente.
- Sin solicitudes a Classgap ni Tusclasesparticulares al renderizar; las tres tarjetas y sus enlaces siguen disponibles con JavaScript desactivado.
- Precios para las tres frecuencias y todos los CTA marcados con `data-junior-cta`: comprobados en móvil y escritorio; la navegación de WhatsApp se interceptó localmente, sin enviar mensajes.
- El contenido previo de `page.tsx` coincide exactamente con `HEAD` al excluir la nueva importación y la inserción del componente. Sin cambios en `ProgramPricing`, `ConsultationLink` ni en los cálculos de `lib/junior-fluency.ts`.
- `git diff --check`: aprobado.

Evidencia local: `C:\Users\zinar\.codex\visualizations\2026\10\26\01a17920-933f-7281-bc75-5ef6df6cb913\junior-testimonials-qa` (capturas por anchura y `results.json`). El script de comprobación está en la carpeta superior y utiliza el Playwright ya disponible en el entorno, sin añadir dependencias al proyecto.

Incidencias del entorno: el primer build encontró `EPERM` en `.next/static/media` y se repitió fuera del sandbox. Next.js 16.4.0 emitió un aviso de vulnerabilidad conocida y detuvo la primera ejecución de cada compilación nueva; las repeticiones completaron el build con código de salida 0. La actualización posterior a Next.js 16.4.3 se completó el 27 de octubre de 2026; véase [la verificación de seguridad](nextjs-security-update.md). También se conserva el aviso previo de deprecación de React 18. No se actualizaron dependencias como parte de la integración inicial de testimonios.
