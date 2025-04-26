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

      <section className="mb-12">
        <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-900">4. Cookies y Tecnologías de Seguimiento</h2>
        <p className="mb-6 text-justify">
          Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra plataforma.
          Estas nos ayudan a:
        </p>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li>Mantener tu sesión activa</li>
          <li>Recordar tus preferencias</li>
          <li>Analizar el uso de la plataforma</li>
        </ul>
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
        <p className="text-center">Última actualización: Marzo 2025</p>
      </footer>
    </div>
  );
}