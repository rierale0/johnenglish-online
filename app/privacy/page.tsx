export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 bg-white text-gray-800 leading-relaxed">
      <h1 className="text-4xl font-serif font-bold mb-8 text-center border-b pb-4">Política de Privacidad</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-900">1. Información que Recopilamos</h2>
        <p className="mb-6 text-justify">
          En John English Online, nos tomamos muy en serio la privacidad de nuestros usuarios. 
          Recopilamos la siguiente información:
        </p>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li>Información de contacto (nombre, correo electrónico)</li>
          <li>Información de progreso en el aprendizaje</li>
          <li>Datos de uso de la plataforma</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-900">2. Uso de la Información</h2>
        <p className="mb-6 text-justify">
          Utilizamos la información recopilada para:
        </p>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li>Personalizar tu experiencia de aprendizaje</li>
          <li>Mejorar nuestros servicios</li>
          <li>Comunicarnos contigo sobre tu progreso</li>
          <li>Enviar actualizaciones importantes sobre el servicio</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-900">3. Protección de Datos</h2>
        <p className="mb-6 text-justify">
          Implementamos medidas de seguridad para proteger tu información personal:
        </p>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li>Encriptación de datos sensibles</li>
          <li>Acceso restringido a la información personal</li>
          <li>Monitoreo regular de seguridad</li>
        </ul>
      </section>

      <section id="cookies" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-900">4. Cookies y Tecnologías de Seguimiento</h2>
        <p className="mb-6 text-justify">
          Guardamos tu elección de cookies durante 180 días en una cookie propia (ewj_marketing_v1).
          Puedes usar la web aunque rechaces la medición publicitaria.
        </p>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li>Solo si aceptas, activamos el píxel de Meta y Conversions API para medir visitas a las páginas comerciales y clics en WhatsApp y evaluar nuestros anuncios.</li>
          <li>Compartimos con Meta el tipo y momento del evento, la URL visitada, el navegador, la dirección IP y los identificadores publicitarios _fbp y _fbc, cuando están disponibles. El envío desde nuestro servidor excluye parámetros y fragmentos de la URL. Estas cookies publicitarias duran hasta 90 días.</li>
          <li>No enviamos nombres, correos, teléfonos ni datos de los niños mediante estos eventos. Un clic en WhatsApp no confirma que hayas enviado un mensaje ni solicitado una asesoría.</li>
          <li>Puedes retirar el permiso desde «Preferencias de cookies», visible en la parte inferior de la página. Al rechazar, detenemos los nuevos eventos y eliminamos las cookies publicitarias propias de Meta.</li>
        </ul>
        <p>Meta puede utilizar estos datos para medición y publicidad según su <a className="underline" href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">política de privacidad</a>. Retirar el permiso no elimina los eventos compartidos previamente.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-900">5. Tus Derechos</h2>
        <p className="mb-6 text-justify">
          Tienes derecho a:
        </p>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li>Acceder a tus datos personales</li>
          <li>Solicitar la rectificación de datos incorrectos</li>
          <li>Solicitar la eliminación de tus datos</li>
          <li>Oponerte al procesamiento de tus datos</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-900">6. Contacto</h2>
        <p className="mb-6 text-justify">
          Para cualquier consulta sobre nuestra política de privacidad, puedes contactarnos en:
          <br />
          <span className="font-medium">Email:</span> privacy@johnenglish.com
        </p>
      </section>

      <footer className="text-sm text-gray-600 border-t pt-4 mt-12">
        <p className="text-center">Última actualización: Octubre 2026</p>
      </footer>
    </div>
  );
}
