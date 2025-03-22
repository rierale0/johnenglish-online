import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const paymentIntentId = params.id;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the payment intent with expanded data
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['customer', 'invoice', 'latest_charge', 'metadata']
    });

    return NextResponse.json(paymentIntent);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment intent' },
      { status: 500 }
    );
  }
}