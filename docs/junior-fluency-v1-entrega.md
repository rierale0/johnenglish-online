# Junior Fluency V1 — entrega y QA

## Resumen

Landing en `/junior-fluency`, basada en todos los documentos del ZIP `junior-fluency-codex-v1.zip`. Contiene el copy propuesto, ilustración suministrada, beneficios, método, servicio Integral, precios, profesor, FAQ y cierre. Dirigida a adultos responsables, desde los 8 años, sin promesas de resultados.

## Iteraciones aprobadas

- Hero con ilustración enmarcada, iconos y distintivo English con bandera de EE. UU.; sin cabecera global en esta ruta.
- Beneficios y cabecera de intereses rediseñados; carrusel de tres intereses con las imágenes seleccionadas por el usuario.
- Método con ilustraciones transparentes, tarjetas de cuatro tonos y animación respetuosa con movimiento reducido.
- Prestaciones con fotografía de clase online y siete bloques de iconos, manteniendo el contenido.
- Presentación del profesor y vídeo reunidos; portada local y reproductor de YouTube cargado al pulsar reproducir.
- Selector con una clase semanal por defecto: Inicio 72 €, Continuidad 192 €. Ayuda desplegable y condiciones en un panel compartido.
- Revisión antes del push: 9 tests unitarios aprobados y prueba funcional de navegador aprobada en 360, 375, 390, 393, 430, 768, 1024 y 1440 px; WhatsApp interceptado localmente.

## Archivos

| Archivo | Cambio |
| --- | --- |
| `app/junior-fluency/page.tsx` | Página de servidor, contenido, navegación interna, metadatos, canonical y OG. |
| `app/junior-fluency/junior-fluency.css` | Estilos locales basados en la home: morado, celeste y lavanda; responsive, foco visible y reducción de movimiento. |
| `components/junior-fluency/ProgramPricing.tsx` | Selector radio nativo, una clase por defecto; precios, servicios y ahorro reactivos. |
| `components/junior-fluency/ConsultationLink.tsx` | CTA compartido; enlaces reales, nueva pestaña anunciada y protección `noopener noreferrer`. |
| `lib/junior-fluency.ts` | Cálculos puros y URL de WhatsApp a partir del contacto configurado en `lib/redirects.ts`. |
| `public/junior-fluency/junior-fluency-hero.webp` | Ilustración original de 1536 × 1024, sin recortes; optimización Next Image habilitada solo para este hero. |
| `components/home/Courses.tsx` | Solo Junior Fluency: enlace accesible a la landing, 4/12 semanas y eliminación de «Beginner». |
| `app/global-components/Footer.tsx` | Prop opcional para asesoría y enlace de privacidad en esta landing; los demás usos conservan su CTA. |
| `app/layout.tsx` | Canonical manual convertido a metadata para permitir que esta ruta lo sustituya sin duplicarlo. |
| `app/sitemap.ts` | Inclusión de la nueva ruta. |
| `tests/junior-fluency.test.mjs` | Precios, actividades, revisiones, ahorro, frecuencias inválidas y contacto. |
| `tests/junior-fluency.browser.mjs` | Pruebas funcionales y capturas en seis anchuras, sin contactar realmente con WhatsApp. |
| `package.json` | `npm test` ejecuta todos los archivos `*.test.mjs`, conservando los tests existentes. |
| `docs/junior-fluency-v1-entrega.md` | Este informe. |

## Probar localmente

Node 24 y dependencias ya instaladas:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run start -- --hostname 127.0.0.1 --port 3011
```

Abrir `http://127.0.0.1:3011/junior-fluency`. También se puede usar `npm run dev` y abrir la ruta en el puerto que indique Next.js.

El test de navegador requiere Playwright y Chrome. No se añadió ninguna dependencia al proyecto. En esta máquina se usó Playwright del runtime integrado de Codex:

```powershell
$env:NODE_PATH='C:\Users\zinar\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$env:JUNIOR_QA_URL='http://127.0.0.1:3011'
node tests/junior-fluency.browser.mjs
```

`JUNIOR_QA_OUTPUT` permite elegir la carpeta de capturas; por defecto usa la carpeta temporal del sistema.

## Resultados

- `npm run lint`: aprobado, sin warnings de ESLint.
- `npm run typecheck`: aprobado.
- `npm test`: 9 aprobados, 0 fallos; incluye los 4 tests existentes de seguridad y 5 nuevos.
- `npm run build`: aprobado con generación estática de `/junior-fluency`.
- Primer intento de build: bloqueado por DNS al descargar la fuente Poppins existente. Se completó con acceso de red autorizado.
- El build inicial mostró un aviso de vulnerabilidad conocida en Next.js 16.4.0 y detuvo una ejecución con `SecurityFatalError`; la repetición permitida por la herramienta completó la compilación. Este pendiente se resolvió el 27 de octubre de 2026 con Next.js 16.4.3; véase [la verificación de seguridad](nextjs-security-update.md).
- Avisos adicionales del stack existente: React 18 está deprecado para Next.js 16 y falta `type: module` explícito en package.json. No se ha migrado el stack.
- Chrome headless: aprobado en 360, 375, 390, 768, 1024 y 1440 px. Se verifica render, único H1, canonical único, título, frecuencia inicial, cambios 1/2/3, cantidades, precios, ahorro, teclado, FAQ, hero decodificado, ausencia de formularios y de overflow horizontal.
- Clics de todos los CTA principales: popup con `wa.me/34613696839` y mensaje exclusivo de Junior Fluency. Las solicitudes se interceptan localmente: no se envían mensajes ni se verifica la aplicación nativa de WhatsApp.
- Se conserva la query UTM durante los cambios de frecuencia. No se almacena ni se envía a un SDK nuevo.
- Navegación desde la tarjeta de la home, privacidad HTTP 200 y sitemap: aprobado.
- Sin errores de consola ni excepciones de hidratación en las seis vistas probadas. Revisión visual de capturas de móvil y escritorio; caras y globos completos.
- Las restricciones de red del entorno exigieron ejecutar navegador y servidor local en el mismo contexto autorizado.

Las capturas y `results.json` se guardaron en `C:\Users\zinar\.codex\visualizations\2026\10\25\01a17353-379a-7a11-8374-12c3bc06930f\junior-fluency-qa`. Son evidencia local, no assets públicos de la web.

## Aceptación

- Implementado: todas las secciones del copy, responsive, ilustración original, atención individual, servicio proporcional, planes, asesoría gratuita de 15–20 minutos y medios de pago informativos.
- Comprobado: las combinaciones Inicio/Continuidad son 72/192 €, 144/384 € y 216/576 €, con ahorro de 24/48/72 € frente a tres inicios de la misma frecuencia.
- No hay formulario ficticio, checkout, suscripción, financiación, inscripción autónoma de menores, testimonios nuevos ni datos personales en URLs analíticas.
- No se ha consultado ni modificado ninguna cuenta, integración o activo de ETM English. No se ha desplegado ni enviado mensajes reales.
- Accesibilidad comprobada parcialmente: semántica, radios nativos, estado anunciado, teclado, foco y áreas táctiles. No sustituye una auditoría integral con tecnologías de asistencia.

## Revisión estética solicitada por el propietario

El 25 de octubre de 2026 se adaptó la landing al estilo de `/`, sustituyendo la dirección crema/naranja inicial por la identidad de la home. El contenido y la oferta se conservan.

- Hero con el mismo recorrido de degradado índigo/morado/rosa, textura sutil y acentos luminosos estáticos.
- Onda blanca inferior como transición hacia beneficios, siguiendo la composición del hero de la home.
- Botones celestes, texto lavanda, tarjetas claras con sombras desplazadas y precios sobre fondo morado.
- FAQ en tarjetas, retrato circular y cierre con degradado celeste/lavanda.
- Cambios limitados al marcado decorativo de `app/junior-fluency/page.tsx`, su CSS y este informe; no se rediseña la home.
- Build y lint aprobados; el build también valida TypeScript. Pruebas funcionales y responsive aprobadas en las seis anchuras, sin errores de consola ni desbordamiento horizontal. Capturas de esta revisión en la carpeta local `junior-fluency-home-style`, junto a `junior-fluency-qa`.

## Decisiones y bloqueos antes de publicar

Revisión de comentarios de navegador: el hero comienza con «Quiero que tu hijo…»; «Hola, soy John» pasa a ser el H2 de la presentación y se eliminan el saludo adicional y el enlace a LinkedIn de esa sección. Beneficios tiene copy más breve y tarjetas compactas. Programas presenta ambos planes completos en móvil, con cantidades, totales y CTA; la explicación ampliada se conserva en un desplegable. Se comprueba que hero, beneficios y programas caben por separado en las vistas de 360/375/390 × 844 px y 393 × 852 px con los desplegables cerrados. Al ampliar texto o abrir la explicación, el contenido puede crecer libremente. Evidencia local en `junior-comments`. Las pruebas funcionales se repiten también en tableta y escritorio.

1. **Resuelto el 27 de octubre de 2026:** actualización de seguridad a Next.js 16.4.3, validada como tarea posterior. Véase [la verificación de seguridad](nextjs-security-update.md).
2. Aprobar copy, precios finales y tratamiento fiscal. No se ha inventado «IVA incluido» ni exención.
3. Aprobar las condiciones de horarios, cambios, ausencias, pausas, cancelación, vencimiento, desistimiento y devoluciones; falta una página completa de términos y aviso legal.
4. Revisar la política `/privacy`: existe y está enlazada, pero usa la denominación John English Online y el correo `privacy@johnenglish.com`. Su validez y correspondencia con el negocio no se han dado por supuestas ni se ha reescrito el documento legal.
5. Confirmar el canal operativo para comunicar revisiones documentadas a la familia. El copy no promete ninguna app, plataforma ni canal específico no verificado.
6. Revisar el tracking global antes de publicar: el layout ya incluye un píxel condicionado a `FB_PIXEL_ID`; no se ha leído/copiado/configurado ningún ID ni se ha verificado una capa de consentimiento. No se añadió analítica para Junior Fluency. Los atributos `data-junior-cta` reservan puntos de integración futura sin emitir eventos. Un clic no equivale a lead o venta.
7. La home general conserva sus promociones de demo gratuita para otros productos y `/r/demo` conserva su destino. Solo se han corregido las menciones específicas de Junior Fluency; cualquier cambio comercial general requiere una decisión editorial aparte.
8. Revisión final del propietario y aprobación explícita de publicación. Esta entrega permanece local.
