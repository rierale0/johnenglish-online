import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia', // Use the latest API version
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the session with expanded data
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'line_items', 'payment_intent'],
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve checkout session' },
      { status: 500 }
    );
  }
}