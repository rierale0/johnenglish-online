# Ilustraciones de intereses — Junior Fluency

## Recorrido visual de aprendizaje

La sección «Cada estudiante aprende a su manera» presenta cuatro tarjetas ilustradas, en dos columnas en escritorio y una secuencia vertical en móvil. Cada tarjeta entra con una transición de opacidad y desplazamiento de 650 ms al hacerse visible, una sola vez. La preferencia de movimiento reducido omite la animación, incluso si cambia durante la visita. El contenido permanece disponible sin JavaScript.

Verificación: `tests/junior-learning-journey.browser.mjs` comprueba seis anchos (360, 393, 430, 768, 1440 y 2560 px), imágenes cargadas, distribución responsive, ausencia de desbordamiento horizontal, una sola entrada por tarjeta, movimiento reducido y contenido sin JavaScript. Los cuatro archivos WebP suman aproximadamente 102 kB.

### Método: punto-partida

Archivo: `public/junior-fluency/metodo-punto-partida.webp`, 480 × 480 px. Generado con la herramienta integrada (sin CLI), optimizado a WebP. Ilustración decorativa acompañada por el texto del paso; original conservado.

Use case: illustration-story. Asset type: one square editorial illustration for one step of Junior Fluency's English tutoring learning journey. Style: polished friendly educational cartoon still life, bold rounded midnight-blue outlines, subtle paper texture, flat colors with very gentle shading. Palette turquoise #7fdeff, lavender #dabfff, warm orange, cream and midnight blue. Composition: centered simple objects with generous 12% safe margins, legible at 120 pixels wide. Full-bleed solid pale lavender backdrop. No people, faces, text, letters, numbers, logos, watermarks, UI mockups, or frames. Scene: a folded map with a winding dotted route and a small destination pin, a magnifying glass and a compass in the foreground. Convey discovering an individual starting point, with cyan and lavender as dominant colors.

### Método: practica-idioma

Archivo: `public/junior-fluency/metodo-practica-idioma.webp`, 480 × 480 px. Generado con la herramienta integrada (sin CLI), optimizado a WebP. Ilustración decorativa acompañada por el texto del paso; original conservado.

Use case: illustration-story. Asset type: one square editorial illustration for one step of Junior Fluency's English tutoring learning journey. Style: polished friendly educational cartoon still life, bold rounded midnight-blue outlines, subtle paper texture, flat colors with very gentle shading. Palette turquoise #7fdeff, lavender #dabfff, warm orange, cream and midnight blue. Composition: centered simple objects with generous 12% safe margins, legible at 120 pixels wide. Full-bleed solid pale lavender backdrop. No people, faces, text, letters, numbers, logos, watermarks, UI mockups, or frames. Scene: an open laptop with two simple large cyan and lavender speech bubbles on its screen, rounded headphones beside it and a small open book. Convey practising language through conversation. No actual application or interface.

### Método: refuerzo

Archivo: `public/junior-fluency/metodo-refuerzo.webp`, 480 × 480 px. Generado con la herramienta integrada (sin CLI), optimizado a WebP. Ilustración decorativa acompañada por el texto del paso; original conservado.

Use case: illustration-story. Asset type: one square editorial illustration for one step of Junior Fluency's English tutoring learning journey. Style: polished friendly educational cartoon still life, bold rounded midnight-blue outlines, subtle paper texture, flat colors with very gentle shading. Palette turquoise #7fdeff, lavender #dabfff, warm orange, cream and midnight blue. Composition: centered simple objects with generous 12% safe margins, legible at 120 pixels wide. Full-bleed solid pale lavender backdrop. No people, faces, text, letters, numbers, logos, watermarks, UI mockups, or frames. Scene: an open exercise notebook with abstract colored lines and small checkmarks, an orange pencil lying diagonally beside it and two simple vocabulary picture cards with a sun and a leaf. Convey practice and helpful correction, no letters or words.

### Método: progreso

Archivo: `public/junior-fluency/metodo-progreso.webp`, 480 × 480 px. Generado con la herramienta integrada (sin CLI), optimizado a WebP. Ilustración decorativa acompañada por el texto del paso; original conservado.

Use case: illustration-story. Asset type: one square editorial illustration for one step of Junior Fluency's English tutoring learning journey. Style: polished friendly educational cartoon still life, bold rounded midnight-blue outlines, subtle paper texture, flat colors with very gentle shading. Palette turquoise #7fdeff, lavender #dabfff, warm orange, cream and midnight blue. Composition: centered simple objects with generous 12% safe margins, legible at 120 pixels wide. Full-bleed solid pale lavender backdrop. No people, faces, text, letters, numbers, logos, watermarks, UI mockups, or frames. Scene: four rounded ascending stepping stones forming a gentle path to a small orange flag, with a simple clipboard with three checkmarks beside them and a small sprouting plant. Convey regular progress review, without scores, grades, numbers or performance promises.

Se han generado cuatro imágenes con la herramienta integrada de generación de imágenes (sin CLI). Estilo editorial ilustrado, sin alumnos reales, personajes, texto ni marcas añadidas. Cada escena se sirve desde una tarjeta con carga diferida y alt descriptivo.

## Archivos finales

La sección «Mucho más que una clase de inglés» usa ahora la fotografía de una clase online aportada por el propietario: `public/junior-fluency/acompanamiento-v2.webp` (960 × 640 px), optimizada a WebP con calidad 84. El asset ilustrado anterior se conserva.

La tarjeta Historias y aventuras utiliza ahora la imagen aportada por el propietario: `public/junior-fluency/historias-v2.webp` (526 × 296 px), convertida a WebP con calidad 88 sin ampliar el original. Conserva el marco común 16:9 y un texto alternativo descriptivo. La ilustración anterior se conserva como versión previa.

La tarjeta Ciencia y tecnología utiliza ahora la fotografía aportada por el propietario: `public/junior-fluency/ciencia-v3.webp` (960 × 640 px), optimizada a WebP con calidad 84. El marco común 16:9 conserva la alineación con las demás tarjetas. La ilustración anterior permanece guardada como versión previa.

Actualización del propietario: las tarjetas Videojuegos, Ciencia y tecnología e Historias y aventuras usan las imágenes aportadas, optimizadas conservando los originales. Las imágenes se muestran en un marco común 16:9 con encuadre centrado para alinear el corte entre imagen y texto. La tarjeta Deportes y aficiones se ha retirado por petición del propietario; su archivo se conserva como recurso anterior.

Las tres tarjetas se presentan ahora en un carrusel con Embla, biblioteca ya instalada. En móvil se muestra una tarjeta y parte de la siguiente; en escritorio, dos. Avanza cada cinco segundos mientras es visible, con pausa al pasar el ratón, interactuar o enfocar controles. Incluye flechas, indicadores, deslizamiento y botón de pausa/reanudación. La preferencia de movimiento reducido desactiva el avance automático y conserva el manejo manual. Las pruebas `tests/junior-interest-carousel.browser.mjs` comprueban avance, pausa, reanudación, controles, teclado, arrastre y movimiento reducido.

- `public/junior-fluency/videojuegos-v2.webp`: 960 × 540 px, imagen de Minecraft aportada por el propietario.
- `public/junior-fluency/ciencia-v2.webp`: 960 × 721 px, ilustración de laboratorio aportada por el propietario.

## Ilustraciones generadas y versiones previas

- `public/junior-fluency/videojuegos.webp`: 960 × 640 px, WebP, calidad 82.
- `public/junior-fluency/ciencia.webp`: 960 × 640 px, WebP, calidad 82.
- `public/junior-fluency/historias.webp`: 960 × 640 px, WebP, calidad 82.
- `public/junior-fluency/deportes.webp`: 960 × 640 px, WebP, calidad 82.

Los originales PNG se conservan en la carpeta de imágenes generadas de Codex. La conversión a WebP mantiene la proporción y la composición completa.

## Prompts finales

### Acompañamiento: sección «Mucho más que una clase de inglés»

Archivo: `public/junior-fluency/acompanamiento.webp`, 960 × 640 px, WebP de 52 598 bytes. Generado con la herramienta integrada de imágenes; los originales se conservan. La sección mantiene las siete prestaciones visibles y ocupa una pantalla móvil (altura mínima `100svh`, sin recortes ni altura máxima). Comprobada en 360/375/390 × 844 px, 393 × 852 px y 430 × 932 px.

Use case: illustration-story. Asset type: compact landscape illustration for the 'what is included' section of Junior Fluency, a family-facing English tutoring website. Create a finished 3:2 landscape illustration showing a welcoming organized study desk: an open laptop displaying simple abstract speech bubbles without text, an open exercise notebook, a pencil, and a small progress checklist with three checkmarks. Style: polished educational editorial cartoon, dark navy outlines, rounded shapes, subtle paper texture. Palette: turquoise, lavender, warm orange, cream and midnight blue, matching a friendly educational illustration. A solid soft lavender backdrop. Center the objects with generous safe margins so the complete scene stays clear at 240px wide. No people, no characters, no letters, no words, no logos, no watermarks. Do not depict an actual branded app or a specific software platform.

### videojuegos

Use case: illustration-story. Asset type: image for an interest card on Junior Fluency, a family-facing English tutoring website. Create one finished landscape illustration in a 3:2 aspect ratio. Style: polished playful editorial cartoon, bold dark navy outlines, simple rounded shapes, flat saturated colors, subtle paper texture, consistent with a warm children's educational illustration. Palette: warm orange, turquoise, lavender, cream and midnight blue. Composition: a clear centered still life with generous safe margins, legible at a small card size, full-bleed pastel background. No people, characters, words, letters, logos, UI, borders or watermarks. Scene: a game controller in the foreground and an imaginative block-built voxel landscape with green hills and a small blocky house behind it. A welcoming creative building adventure, with an apricot-orange sky.

### ciencia

Use case: illustration-story. Asset type: image for an interest card on Junior Fluency, a family-facing English tutoring website. Create one finished landscape illustration in a 3:2 aspect ratio. Style: polished playful editorial cartoon, bold dark navy outlines, simple rounded shapes, flat saturated colors, subtle paper texture, consistent with a warm children's educational illustration. Palette: warm orange, turquoise, lavender, cream and midnight blue. Composition: a clear centered still life with generous safe margins, legible at a small card size, full-bleed pastel background. No people, characters, words, letters, logos, UI, borders or watermarks. Scene: a small friendly tabletop science setup with a microscope, flask containing turquoise liquid, and an orbiting planet model. Lavender background, warm orange and turquoise accents. Clear simple shapes, inviting curiosity.

### historias

Use case: illustration-story. Asset type: image for an interest card on Junior Fluency, a family-facing English tutoring website. Create one finished landscape illustration in a 3:2 aspect ratio. Style: polished playful editorial cartoon, bold dark navy outlines, simple rounded shapes, flat saturated colors, subtle paper texture, consistent with a warm children's educational illustration. Palette: warm orange, turquoise, lavender, cream and midnight blue. Composition: a clear centered still life with generous safe margins, legible at a small card size, full-bleed pastel background. No people, characters, words, letters, logos, UI, borders or watermarks. Scene: an open storybook with illustrated pages transforming into a tiny imaginative landscape of mountains, a winding path and a distant castle, a few paper stars floating above. Turquoise background and warm orange accents. No letters on the pages.

### deportes

Use case: illustration-story. Asset type: image for an interest card on Junior Fluency, a family-facing English tutoring website. Create one finished landscape illustration in a 3:2 aspect ratio. Style: polished playful editorial cartoon, bold dark navy outlines, simple rounded shapes, flat saturated colors, subtle paper texture, consistent with a warm children's educational illustration. Palette: warm orange, turquoise, lavender, cream and midnight blue. Composition: a clear centered still life with generous safe margins, legible at a small card size, full-bleed pastel background. No people, characters, words, letters, logos, UI, borders or watermarks. Scene: a cheerful still life of a football, basketball and tennis racket with a tennis ball, arranged on a simple sports court. Pale lavender and turquoise background, orange accents. Equipment and court only.

