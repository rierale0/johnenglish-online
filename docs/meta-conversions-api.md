# Meta Pixel + Conversions API

Dataset existente: `28816945551285566` («Datos de inglesconjohn.es»).

## Variables de Vercel

| Variable | Valor / finalidad |
| --- | --- |
| `FB_PIXEL_ID` | `28816945551285566`, el mismo ID para navegador y servidor. Ya existía en producción. |
| `META_CAPI_ACCESS_TOKEN` | Token privado con acceso a eventos del dataset; configurado por el propietario en Vercel. Nunca usar prefijo `NEXT_PUBLIC_`. |
| `META_GRAPH_API_VERSION` | Opcional; por defecto `v26.0`. |
| `META_CAPI_TEST_EVENT_CODE` | Solo durante la verificación: `TEST54046`. Quitar después y volver a desplegar para enviar eventos de producción. |

Los cambios en variables de Vercel requieren un nuevo despliegue. No hay token local ni se guarda en Git. Que el token se haya generado desde la opción Dataset Quality API no confirma sus permisos: la recepción en Meta es la verificación definitiva.

## Comportamiento

- El consentimiento empieza sin conceder. Aceptar y rechazar tienen el mismo tamaño y contraste de texto equivalente: aceptar lleva fondo morado y rechazar, fondo blanco con borde morado. La elección dura 180 días. «Preferencias de cookies» en el pie de página permite cambiarla, sin ningún botón flotante.
- Antes de aceptar no se carga `fbevents.js`, no se crean `_fbp` / `_fbc` y no se llama al endpoint de medición. Rechazar revoca el píxel, descarta eventos pendientes de su cola y borra esas cookies propias (hasta 90 días de duración).
- Solo `/` y `/junior-fluency` producen `PageView`. La navegación interna también se mide una vez por cambio de ruta. Las páginas de alumnos y las redirecciones no generan eventos propios.
- Los enlaces a WhatsApp, los enlaces internos de demo/contacto y las tarjetas comerciales que abren WhatsApp producen `WhatsAppClick`. Es un evento personalizado de intención, **no** un `Lead`, una conversación confirmada, una reserva ni una compra.
- `Junior Fluency Ask` es el nombre exacto del evento personalizado de solicitud de llamada confirmada. Solo se dispara en `/junior-fluency`, después de HTTP correcto y `{ accepted: true }` en el formulario. Se usa el `submissionId` como identificador compartido de Pixel y CAPI. Se respeta el consentimiento publicitario vigente; aceptar cookies después de enviar el formulario no reproduce conversiones anteriores. El aviso solo transporta el UUID, sin nombre ni teléfono.
- Cada acción genera un UUID compartido entre `eventID` del píxel y `event_id` de CAPI, con el mismo nombre de evento. La configuración automática del píxel está desactivada para evitar eventos adicionales de botones.
- Se envían tipo/momento del evento, URL comercial canónica, ubicación del botón, navegador, IP facilitada por Vercel y cookies de atribución, cuando están disponibles. No se recogen nombres, correos, teléfonos ni información de alumnos. El envío del servidor elimina parámetros y fragmentos de la URL; el píxel de Meta recibe también la URL del navegador según su funcionamiento habitual.
- No se reintenta automáticamente una entrega fallida: la interacción del visitante sigue funcionando. Los logs solo incluyen estado HTTP y código numérico de Meta. Sin token/configuración válida el servidor omite la entrega; el píxel puede seguir funcionando con consentimiento.

## Endpoint

`POST /api/meta/events` exige un origen permitido, consentimiento y JSON de un máximo de 1024 bytes. Se permiten el dominio canónico, `www` y las URLs de despliegue/branch configuradas por Vercel; solo en desarrollo se añaden localhost/127.0.0.1 del puerto local. Nunca se amplía esa lista a partir de la cabecera Host del cliente. Las peticiones que el navegador identifica como cross-site o same-site se rechazan. Solo admite los nombres, rutas, posiciones y UUID definidos en `lib/meta-events.ts`. El cliente nunca elige destino, dataset, datos personales, fecha ni código de prueba. El token se envía a Graph mediante `Authorization: Bearer`, nunca en la URL.

Respuestas sin datos personales: `202` aceptado por Meta o duplicado local, `204` configuración ausente, `400` cuerpo inválido, `403` origen/consentimiento inválido, `429` límite, `502` entrega fallida. El navegador no espera la respuesta para navegar. El límite de 60 eventos/minuto por IP y la supresión de duplicados son por instancia; no sustituyen un límite distribuido en Vercel si aumenta el tráfico abusivo.

## Verificar en Meta

1. Configurar temporalmente `META_CAPI_TEST_EVENT_CODE=TEST54046` junto al token y desplegar esta versión.
2. Abrir una ventana privada en la web desplegada, comprobar que no hay peticiones a Meta antes de aceptar y pulsar «Aceptar».
3. En Meta → Administrador de eventos → Datos de inglesconjohn.es → Probar eventos, comprobar la recepción de `PageView` por servidor. En la red del navegador el POST propio debe responder `202`; `502` requiere revisar el código de error en logs de Vercel (por ejemplo, `190` indica un problema de token).
4. Pulsar una asesoría de Junior Fluency y comprobar `WhatsAppClick`. Comparar identificadores entre navegador y servidor para verificar deduplicación. El código de prueba solo se aplica al envío de servidor.
5. Rechazar desde «Preferencias de cookies», volver a navegar y confirmar que cesan los nuevos eventos y desaparecen `_fbp` / `_fbc`.
6. Quitar `META_CAPI_TEST_EVENT_CODE` y desplegar otra vez para habilitar el envío normal. No dejar el código de pruebas activo permanentemente.

Las pruebas automatizadas simulan Graph y el píxel; no prueban permisos del token ni confirman recepción real en Meta.

## Conversión personalizada Junior Fluency Ask

Creada en Meta el 30/10/2026. Cuenta John English Online (1164463585142163), dataset Datos de inglesconjohn.es (28816945551285566). ID de conversión: 1669171581225460. Categoría: LEAD (Cliente potencial).

Regla verificada desde el conector: PageView y conversion_name igual a Junior Fluency Ask. La visita inicial nunca lleva esa etiqueta. Tras recibir accepted:true, la vista de confirmación genera un PageView etiquetado y el evento personalizado Junior Fluency Ask. Se conserva el submissionId como identificador de ambos eventos; Meta deduplica las copias navegador/servidor por nombre e identificador. La misma solicitud produce una sola conversión, porque solo la vista de confirmación cumple la regla. El total de PageView incluye esa vista adicional de confirmación.

Solo se mide con consentimiento publicitario vigente. Ningún evento incluye nombre ni teléfono. El evento personalizado y la etiqueta se verificaron como Procesado en la herramienta de pruebas de Meta; CAPI respondió HTTP 202. La landing y el webhook están publicados en producción. Meta puede mostrar la conversión inactiva hasta que procese una coincidencia posterior a su creación. Las campañas todavía deben seleccionar esta conversión como objetivo; esta tarea no cambia campañas ni presupuestos.
