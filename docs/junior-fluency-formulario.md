# Solicitud de llamada

El formulario del hero recoge nombre del adulto, teléfono y permiso de contacto para la asesoría. Los CTA de navegación, programas, profesor, cierre y pie enlazan a `#solicitar-llamada`. WhatsApp sigue disponible como alternativa.

## Conexión a Telegram

Flujo activo: https://n8n.riera.dev/workflow/DeVcAMer7oZKJsOg (`/junior-fluency to Telegram`). John autorizó el chat `7615749204`, con la credencial existente «English with John». El webhook recibe POST, comprueba origen de formulario, consentimiento y formato de datos, y conecta Webhook → Send a text message → Confirmar recepción. Los nombres se escapan para evitar interpretación como HTML en Telegram.

El flujo responde `{ "accepted": true }` después del envío correcto. `.env.local` contiene `JUNIOR_CONSULTATION_WEBHOOK_URL` apuntando al webhook de producción y está excluido de Git. Al desplegar la landing, configurar esa misma variable en el entorno de alojamiento. `JUNIOR_CONSULTATION_WEBHOOK_TOKEN` es opcional si se habilita autenticación Bearer en el receptor; actualmente no está habilitada. Nunca usar prefijo NEXT_PUBLIC para estas variables. La landing está publicada en https://inglesconjohn.es/junior-fluency y la variable del webhook está configurada en producción.

El receptor debe comprobar el token Bearer si se configura y responder con JSON `{ "accepted": true }` solo después de recibir la solicitud en el destino. Se proporciona `submissionId` (también como `Idempotency-Key`) para implementar deduplicación en n8n. El identificador se conserva al reintentar con los mismos datos; cambiar los datos o recargar la página genera otro. La deduplicación no está implementada en el flujo actual: un reintento después de perderse la respuesta podría repetir el aviso de Telegram.

Se envían `name`, `phone` normalizado con prefijo internacional, `consent`, `submissionId`, `source`, `consentVersion` y `receivedAt`. No se registran datos de contacto en consola, almacenamiento del navegador ni eventos de Meta. Los enlaces internos al formulario no cuentan como clics de WhatsApp.

Sin configuración, la API devuelve 503 y el formulario ofrece reintentar o contactar por WhatsApp; nunca simula una recepción correcta. Las pruebas automatizadas de API usan un receptor simulado. La prueba real del 30/10/2026 recorrió navegador local → API → webhook de producción → Telegram → confirmación visible. Se envió una solicitud sintética «PRUEBA TÉCNICA - NO LLAMAR» con un número reservado de ejemplo. Ejecución n8n `42380`: success; API: HTTP 200.

La API comprueba origen, contenido, tamaño real del cuerpo (4 KB), consentimiento, teléfono y campo antispam. Antes de activar campañas, añadir limitación de frecuencia en el receptor o infraestructura y verificar almacenamiento, deduplicación y entrega real con el destino elegido.
