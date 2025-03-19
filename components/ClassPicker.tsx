"use client";

import { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Calendar } from '@/components/ui/calendar';
import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface ClassPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentForm = ({ selectedDate, selectedTime, onSuccess }: { selectedDate: Date; selectedTime: string; onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [canMakePayment, setCanMakePayment] = useState(false);

  const paymentRequest = stripe?.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: {
      label: 'Class Payment',
      amount: 5000, // Example amount in cents
    },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  useEffect(() => {
    const checkPaymentRequest = async () => {
      if (paymentRequest) {
        const result = await paymentRequest.canMakePayment();
        setCanMakePayment(!!result);
      }
    };
    checkPaymentRequest();
  }, [paymentRequest]);

  paymentRequest?.on('paymentmethod', async (event) => {
    const result = await stripe?.confirmCardPayment('{CLIENT_SECRET}', {
      payment_method: event.paymentMethod.id,
    });

    if (result?.error) {
      event.complete('fail');
    } else {
      event.complete('success');
      onSuccess();
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
      billing_details: {
        name,
        email,
      },
    });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // Send paymentMethod.id, selectedDate, selectedTime, name, and email to backend
    setLoading(false);
    onSuccess();
  };

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="relative mb-2">
        {nameFocused && name && (
          <label className="absolute top-1 left-2 text-[8px] text-gray-400">Nombre</label>
        )}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          className="p-3 border-none rounded w-full bg-[#3D3F70] text-white placeholder-gray-300"
        />
      </div>
      <div className="relative mb-2">
        {emailFocused && email && (
          <label className="absolute top-1 left-2 text-[8px] text-gray-400">Email</label>
        )}
        <input
          type="email"
          placeholder="tucorreo@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          className="p-3 border-none rounded w-full bg-[#3D3F70] placeholder-gray-300"
        />
      </div>
      <CardElement
        options={{
          style: {
            base: {
              color: '#ffffff', // Set text color to white
              '::placeholder': {
                color: '#ffffff', // Set placeholder text color to white
              },
            },
          },
        }}
        className="p-3 border-none rounded mb-2 bg-[#3D3F70] text-white"
      />
      {canMakePayment && paymentRequest && (
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? 'Processing...' : 'Pay and Schedule Class'}
      </button>
    </form>
  );
};

export default function ClassPicker({ isOpen, onClose }: ClassPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const mockAvailableSlots = {
      '2025-03-22': ['10:00', '11:00', '14:00'],
      '2025-03-23': ['09:00', '13:00', '16:00'],
      '2025-03-24': ['10:00', '12:00', '15:00'],
    };
    setAvailableSlots(mockAvailableSlots);
  }, []);

  if (!isOpen) return null;

  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  return (
    <div
      className="fixed inset-0 bg-[#4F518C] bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#2C2A4A] rounded-lg shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Reserva una clase</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="flex justify-center w-full">
          <Calendar
            selected={selectedDate || undefined}
            fromDate={new Date(today)}
            toDate={maxDate}
            mode='single'
            disabled={(date) => !Object.keys(availableSlots).includes(date.toISOString().split('T')[0])}
            onSelect={(date: Date | undefined) => {
              setSelectedDate(date || null);
              setSelectedTime(null);
            }}
            className="border rounded-lg text-white bg-[#4F518C] bg-opacity-20 backdrop-blur-md border-[#4F518C] border-opacity-50"
          />
        </div>

        {selectedDate && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white">
              {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            <h3 className="text-md font-light text-white">Selecciona una hora</h3>
            <div className="flex flex-wrap mt-2">
              {availableSlots[selectedDate.toISOString().split('T')[0]]?.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`m-1 px-4 py-2 rounded ${selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                >
                  {time}
                </button>
              ))}
<div className="ml-2 mt-2 flex flex-col gap-0">
  <p className="text-2xl font-bold text-white">€16</p>
  <p className="text-sm font-light text-white">por clase</p>
</div>
            </div>
          </div>
        )}

        {selectedDate && selectedTime && (
          <Elements stripe={stripePromise}>
            <PaymentForm
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSuccess={() => {
                alert('Payment successful! Class scheduled.');
                onClose();
              }}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}

