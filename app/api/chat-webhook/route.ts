import { NextResponse } from 'next/server';

// La URL real del webhook se almacena en una variable de entorno del servidor
const WEBHOOK_URL = process.env.CHATBOT_WEBHOOK_URL;

export async function POST(request: Request) {
  try {
    // Verificar que la URL del webhook esté configurada
    if (!WEBHOOK_URL) {
      console.error('WEBHOOK_URL no está configurado en las variables de entorno');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      );
    }

    // Obtener los datos de la solicitud
    const data = await request.json();

    // Reenviar la solicitud al webhook real
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Obtener la respuesta del webhook
    const responseText = await webhookResponse.text();
    
    // Intentar analizar como JSON, si falla, devolver como texto
    try {
      const jsonResponse = JSON.parse(responseText);
      return NextResponse.json(jsonResponse);
    } catch (e) {
      // Si no es JSON, devolver como texto en un objeto JSON
      return NextResponse.json({ response: responseText });
    }
  } catch (error) {
    console.error('Error al procesar la solicitud del webhook:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}