# Movimiento de bienvenida en Junior Fluency

Fecha: 27 de octubre de 2026.

## Criterio de diseño

La entrada acompaña el mensaje principal de confianza y aprendizaje sin retrasar su lectura ni el acceso a la asesoría gratuita. Se conserva la composición, ilustración, tipografía, colores, textos y tamaño del hero.

- El titular, la descripción y los indicadores entran con un desplazamiento vertical corto y escalonado. El texto mantiene opacidad completa desde el primer fotograma.
- El subrayado de «gane confianza» se dibuja suavemente.
- La tarjeta ilustrada se asienta con un giro pequeño y un único movimiento vertical de bienvenida. El distintivo de inglés, la estrella y el anillo decorativo acompañan la entrada.
- El botón conserva su posición y área de pulsación durante toda la entrada. Su flecha responde al hover o al foco en dispositivos con ratón.
- Todas las animaciones automáticas terminan antes de tres segundos; no hay bucles ni repetición al volver a subir por la página.
- En móvil se reduce la amplitud del movimiento.

La entrada del hero utiliza únicamente CSS, sin añadir bibliotecas, imágenes, componentes de cliente ni JavaScript para esa entrada. Sus animaciones se ejecutan al cargar el documento. Los únicos elementos con cambios de opacidad son decorativos; el contenido y la ilustración siguen disponibles desde el principio.

## Accesibilidad y validación

- `npm run lint` y `npm run build`: aprobados. La compilación también completa la comprobación de TypeScript y la generación estática de la landing.
- `prefers-reduced-motion` desactiva el movimiento. El cambio de preferencia también detiene las animaciones que estén en curso.
- El contenido y el enlace a WhatsApp funcionan con JavaScript desactivado.
- `tests/junior-hero.browser.mjs`: Chrome en 360, 393, 430, 768 y 1440 px. Comprobados el final de las animaciones, su ejecución única, la visibilidad del titular y el botón, la posición estable del CTA, el encaje del hero en las pantallas móviles y la ausencia de desbordamiento horizontal durante la entrada.
- La navegación a WhatsApp se comprueba mientras la entrada está activa, interceptando la solicitud localmente, sin enviar mensajes.
- Las comprobaciones de movimiento reducido, cambio de preferencia y contenido sin JavaScript están incluidas en el mismo script.
- Capturas finales de móvil y escritorio revisadas visualmente. Evidencia local y resultados en `C:\Users\zinar\.codex\visualizations\2026\10\26\01a17920-933f-7281-bc75-5ef6df6cb913\junior-hero-motion`.

Esta revisión no implica una medición del impacto en campañas o contratación. La entrada puede verse recargando `/junior-fluency` desde el inicio, sin el ancla de otra sección.

## Continuidad al recorrer el resto de la página

La revisión posterior conserva todos los textos, atributos, enlaces y la jerarquía de elementos de la página. Se ha comparado el DOM completo antes y después en el mismo tamaño y estado inicial.

- `SectionMotion` no renderiza elementos: utiliza un único `IntersectionObserver` para activar entradas de 520 ms al aparecer los bloques.
- Se animan encabezados, tarjetas de beneficios, acompañamiento, citas de testimonios, presentación, ayuda de programas y título de cierre. El movimiento vertical es de 8 px en móvil y 12 px en escritorio, con un escalonado máximo de 110 ms en los grupos de tres.
- Los bloques conservan opacidad completa. El movimiento usa la propiedad independiente `translate` para mantener los efectos hover existentes.
- Los controles interactivos y sus contenedores quedan fuera de los objetivos. No se mueven precios, selectores, botones, vídeo ni enlaces durante estas entradas.
- Cada bloque se anima una vez y después deja de observarse. No se añaden listeners de scroll ni bucles de animación. Se conservan las animaciones existentes de metodología y carrusel.
- Las respuestas de FAQ y la orientación de programas tienen una apertura breve de 200 ms. Las flechas y el icono de reproducción tienen transiciones de interacción discretas.
- El movimiento reducido evita las entradas y cancela las activas si cambia la preferencia. Sin JavaScript todo el contenido sigue visible.

La referencia previa del DOM y la verificación se guardan en la carpeta local de visualizaciones de este chat; los resultados y las capturas de esta revisión usan `junior-page-motion`.

Validación de la revisión general: lint, tipos y build aprobados. Chrome en 393, 430 y 1440 px: las 18 entradas se ejecutan una sola vez, sin ocultar texto, mover controles ni producir desbordamiento horizontal. Comprobados FAQ, orientación de programas, movimiento reducido, cambio de preferencia y acceso al contenido sin JavaScript. La comparación exacta del texto y de la jerarquía, atributos y orden del DOM con la referencia anterior está aprobada.
