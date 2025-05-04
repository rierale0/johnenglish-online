import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'eur', metadata = {}, items = [] } = body;

    // Prepare metadata with class dates
    const enhancedMetadata: Record<string, string> = { ...metadata };
    
    // Add class dates to metadata if provided in items
    if (items && items.length > 0) {
      items.forEach((item: any, index: number) => {
        if (item.classDate) {
          enhancedMetadata[`class_date_${index}`] = item.classDate;
        }
      });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: enhancedMetadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}