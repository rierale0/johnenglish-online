import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function GET(
  request: Request,
) {
  try {
    // Accedemos al ID de la sesión de pago desde los parámetros de la URL
    const url = await request.url
    const sessionId = url.split('/').pop(); // Obtener el último segmento de la URL, que es el sessionId
    // Verificamos que el sessionId sea válido
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Obtener la sesión de pago (checkout session) usando el sessionId
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Extraer el Payment Intent ID de la sesión de pago
    const paymentIntentId = session.payment_intent;

    console.log('Payment Intent ID:', paymentIntentId);

    // Verificamos si el Payment Intent ID existe
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID not found in the session' },
        { status: 404 }
      );
    }

    // Recuperamos el Payment Intent con su ID
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string, {
      expand: ['customer', 'invoice', 'latest_charge'],
    });

    // Respondemos con los detalles del Payment Intent
    return NextResponse.json(paymentIntent);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment intent' },
      { status: 500 }
    );
  }
}
