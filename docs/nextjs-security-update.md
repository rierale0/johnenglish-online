# Actualización de seguridad de Next.js

Fecha: 27 de octubre de 2026.

## Cambio

- Next.js pasa de 16.4.0 a 16.4.3, fijado de forma exacta en `package.json` y `package-lock.json`.
- Se actualizan también `@next/env` y los binarios SWC de Next.js en el lockfile. No se cambian las versiones de React, la configuración de seguridad ni el contenido de las páginas.
- El parche conserva la compatibilidad con React 18.3.1 y Node.js 24.19.0 instalados.

El [aviso oficial de seguridad del 14 de octubre](https://nextjs.org/blog/nextjs-security-update-october-14-2026) identifica las correcciones disponibles desde 16.4.1 para ejecución remota de código en Cache Components y optimización de imágenes, y denegación de servicio en Server Actions. La [versión estable 16.4.3](https://github.com/vercel/next.js/releases/tag/v16.4.3), consultada en npm el día de esta actualización, incorpora esas correcciones y otros arreglos del mismo ciclo 16.4.

## Verificación

- `package.json`, el lockfile y el paquete instalado coinciden en 16.4.3.
- `npm run typecheck`: aprobado.
- `npm test`: nueve pruebas aprobadas.
- `npm run build`: lint, TypeScript y generación de las 19 páginas completados con código de salida 0, sin `SecurityFatalError` ni recordatorio de vulnerabilidad de Next.js.
- `npm audit --omit=dev`: cero vulnerabilidades.
- Servidor de desarrollo reiniciado en `http://127.0.0.1:3011` con Next.js 16.4.3; arranca correctamente sin el aviso de seguridad anterior.
- Chrome: comprobación de la landing en 360, 375, 390, 393, 430, 768, 1024 y 1440 px, sin errores de consola ni desbordamiento horizontal. Precios, cantidades, selector con teclado, FAQ, enlaces de WhatsApp (interceptados localmente), navegación desde la home, privacidad y sitemap aprobados.
- Evidencia local: `C:\Users\zinar\.codex\visualizations\2026\10\26\01a17920-933f-7281-bc75-5ef6df6cb913\nextjs-16.4.3\results.json` y capturas en la misma carpeta.

## Avisos independientes

La auditoría completa conserva un aviso alto de `zod@4.6.5` (GHSA-mrhx-c7xc-m3w5), dependencia de desarrollo de `eslint-plugin-react-hooks`. No forma parte de las dependencias de producción. La actualización de Next.js no modifica ese paquete.

Next.js mantiene el aviso previo de deprecación de React 18, aunque esta versión sigue dentro del rango de compatibilidad del parche instalado. Una migración de React no ha sido necesaria para resolver el aviso de seguridad de Next.js.
