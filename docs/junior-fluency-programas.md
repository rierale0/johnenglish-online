# Revisión de programas y precios

## Objetivo

Facilitar a madres, padres y tutores la comparación de los dos programas, manteniendo la transparencia sobre el compromiso económico y la asesoría gratuita como siguiente paso.

## Presentación

- Se conserva el título «Elige cómo empezar.» y la identidad visual de la landing: fondo morado, tarjetas claras, acentos celestes y tipografía Poppins.
- El precio por clase es la referencia principal: 18 € en Inicio y 16 € en Continuidad, siempre junto a la unidad y los 60 minutos de duración.
- Cada tarjeta muestra su duración, el importe completo y que se realiza un único pago antes de empezar. El total no depende de abrir un desplegable.
- El selector de una, dos o tres clases semanales actualiza los totales y las cantidades de clases, actividades corregidas y revisiones.
- Inicio se presenta como una primera etapa de cuatro semanas; Continuidad como doce semanas para practicar y consolidar. El distintivo de menor precio por clase es factual, sin afirmar que sea el programa más vendido.
- El ahorro de Continuidad identifica el período de doce semanas y su comparación con tres planes de Inicio de la misma frecuencia.
- Los dos botones siguen llevando a la misma asesoría gratuita por WhatsApp. El mensaje final aclara que no hace falta elegir un programa antes de escribir.
- En móvil las tarjetas crecen verticalmente para conservar textos legibles, importes completos y condiciones visibles. Se retira la restricción anterior de encajar toda la sección en una sola pantalla.

## Oferta conservada

No se modifican `getJuniorPricing`, las tarifas, las duraciones, las cantidades de servicio ni el destino y mensaje de WhatsApp.

| Clases por semana | Inicio · 4 semanas | Continuidad · 12 semanas | Ahorro en 12 semanas |
| --- | --- | --- | --- |
| 1 | 4 clases · 72 € | 12 clases · 192 € | 24 € |
| 2 | 8 clases · 144 € | 24 clases · 384 € | 48 € |
| 3 | 12 clases · 216 € | 36 clases · 576 € | 72 € |

Se mantienen el pago anticipado por tarjeta (Stripe) o Bizum, los horarios según disponibilidad y la comunicación de las condiciones de cambios y cancelaciones antes de contratar.

## Comprobaciones

- Lint y TypeScript sin errores; nueve pruebas unitarias y de seguridad aprobadas. `npm run build` completado con código de salida 0 y generación estática de la landing.
- Prueba de navegador existente actualizada para comprobar el precio por clase, el total visible, las duraciones y el pago anticipado junto al importe.
- Chrome sobre el servidor de desarrollo: 360, 375, 390, 393, 430, 768, 1024 y 1440 px. Aprobados precios, cantidades, ahorro, teclado, navegación y ausencia de desbordamiento horizontal y errores de consola. Los clics de WhatsApp se interceptan localmente, sin enviar mensajes.
- Revisión adicional a 320 px, texto al 200% y precios iniciales visibles con JavaScript desactivado.
- Capturas revisadas en móvil, tableta y escritorio. Evidencia local en `C:\Users\zinar\.codex\visualizations\2026\10\26\01a17920-933f-7281-bc75-5ef6df6cb913\junior-pricing`; resultados de navegador en `regression/results.json`.

La mejora aplica criterios de claridad y comparación; no se ha medido todavía un cambio en contratación o conversión.
