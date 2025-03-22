import { NextResponse } from 'next/server';
import { Stripe } from 'stripe';
import { classPrices } from '@/types/class';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const { classes, total } = await request.json();
    
    if (!classes || classes.length === 0) {
      return NextResponse.json(
        { error: 'No classes selected' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = classes.map((cls: any) => {
      const classType = cls.type;
      const price = classPrices[classType as keyof typeof classPrices]?.price || 0;
      
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Clase de Inglés ${cls.date} a las ${cls.hour}`,
            // description: `${cls.date} a las ${cls.hour}`,
          },
          unit_amount: price * 100, // Stripe uses cents
        },
        quantity: 1,
      };
    });

    // Add discount if applicable
    let discountAmount = 0;
    if (classes.length >= 10) {
      // 20% discount
      discountAmount = Math.round(total * 0.2 * 100);
    } else if (classes.length >= 5) {
      // 10% discount
      discountAmount = Math.round(total * 0.1 * 100);
    }

    // Create a coupon if there's a discount
    let coupon;
    if (discountAmount > 0) {
      coupon = await stripe.coupons.create({
        amount_off: discountAmount,
        currency: 'eur',
        duration: 'once',
        name: classes.length >= 10 ? 'Descuento 20%' : 'Descuento 10%',
      });
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      discounts: coupon ? [{ coupon: coupon.id }] : [],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/schedule-a-class`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}