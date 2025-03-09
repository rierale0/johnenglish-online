'use client'; // Asegura que se ejecute en el lado del cliente

import { useState } from 'react';

export default function Form() {
  const [nombre, setNombre] = useState('');
  const [hora, setHora] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [asistenciaRegistrada, setAsistenciaRegistrada] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes enviar los datos a una API, guardarlos en una base de datos, etc.
    console.log({ nombre, hora, comentarios });
    setAsistenciaRegistrada(true); // Muestra un mensaje de éxito
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="hora">Hora de llegada:</label>
        <input
          type="time"
          id="hora"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="comentarios">Comentarios (opcional):</label>
        <textarea
          id="comentarios"
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
        />
      </div>

      <button type="submit">Registrar asistencia</button>

      {asistenciaRegistrada && <p>¡Gracias! Su asistencia ha sido registrada.</p>}
    </form>
  );
}
