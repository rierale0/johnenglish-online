'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Suspense } from 'react'

interface PaymentData {
  sessionId?: string;
  customerName?: string;
  amount?: string;
  email?: string;
  productName?: string;
  date?: string;
  lineItems?: any[]; // Add this line to store line items
}

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentData>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Extract session_id from URL
    const sessionId = searchParams.get('session_id')
    
    if (sessionId) {
      // Store the session ID
      setPaymentData(prev => ({ ...prev, sessionId }))
      
      // Fetch session details from your backend
      setIsLoading(true)
      fetch(`/api/checkout-sessions/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          console.log('Session data:', data); // For debugging
          
          // If we have a payment intent, we can fetch more details
          const paymentIntent = data.payment_intent;
          
          if (paymentIntent) {
            // Fetch payment intent details
            return fetch(`/api/payment-intents/${paymentIntent}`)
              .then(res => res.json())
              .then(paymentData => {
                console.log('Payment intent data:', paymentData);
                
                // Combine session and payment intent data
                return {
                  ...data,
                  paymentIntentDetails: paymentData
                };
              });
          }
          
          return data;
        })
        .then(data => {
          const paymentDataObj = {
            sessionId,
            customerName: data.customer_details?.name,
            email: data.customer_details?.email,
            amount: new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: data.currency
            }).format(data.amount_total / 100),
            amountRaw: data.amount_total / 100,
            currency: data.currency,
            productName: data.line_items?.data[0]?.description,
            date: new Date(data.created * 1000).toLocaleDateString('es-ES'),
            lineItems: data.line_items?.data || [],
            paymentIntentDetails: data.paymentIntentDetails as Record<string, unknown>
          };
          
          setPaymentData(paymentDataObj);
          
          // Send data to n8n webhook
          sendToN8nWebhook(paymentDataObj);
        })
        .catch(err => console.error('Error fetching payment data:', err))
        .finally(() => setIsLoading(false))
    }
  }, [router, searchParams])

  // Function to send data to n8n webhook
  const sendToN8nWebhook = async (data: any) => {
    try {
      const response = await fetch('https://n8n.johnenglish.online/webhook/910ec546-81b5-4084-99da-eb73600c731c', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'payment_success',
          timestamp: new Date().toISOString(),
          data: {
            sessionId: data.sessionId,
            customerName: data.customerName,
            email: data.email,
            amount: data.amountRaw,
            currency: data.currency,
            date: data.date,
            lineItems: data.lineItems.map((item: any) => ({
              description: item.description,
              amount: item.amount_total / 100,
              quantity: item.quantity
            }))
          }
        }),
      });
      
      if (response.ok) {
        console.log('Successfully sent data to n8n webhook');
      } else {
        console.error('Failed to send data to n8n webhook:', await response.text());
      }
    } catch (error) {
      console.error('Error sending data to n8n webhook:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-green-500 mb-6"
      >
        <CheckCircle size={80} />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-gray-800 mb-4 text-center"
      >
        ¡Gracias por tu compra!
      </motion.h1>
      
      {isLoading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 mb-4"
        >
          Cargando detalles del pago...
        </motion.p>
      ) : (
        <>
          {paymentData.customerName && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-700 text-center font-medium mb-2"
            >
              Hola {paymentData.customerName}
            </motion.p>
          )}
          
          {/* Display detailed line items */}
          {paymentData.lineItems && paymentData.lineItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="w-full max-w-md bg-white rounded-lg shadow-sm p-4 mb-4"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-2">Detalle de compra:</h3>
              <div className="space-y-2">
                {paymentData.lineItems.map((item: any, index: number) => {
                  // Try to get class date from payment intent metadata
                  const paymentIntentMetadata = ((paymentData as PaymentData & { paymentIntentDetails?: Record<string, unknown> }).paymentIntentDetails)?.metadata || {};
                  const classDateKey = `class_date_${index}`;
                  
                  // Look for class date in various places
                  const classDate = 
                    (paymentIntentMetadata as Record<string, string>)[classDateKey] ||
                    item.price?.product_data?.metadata?.class_date ||
                    '';
                  
                  return (
                    <div key={index} className="flex justify-between items-start border-b border-gray-100 pb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.description}</p>
                        {classDate ? (
                          <p className="text-sm text-gray-600 font-medium">
                            {classDate}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            Fecha no disponible
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <p className="text-gray-800">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: item.currency
                        }).format(item.amount_total / 100)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
                <p className="font-medium text-gray-800">Total:</p>
                <p className="font-bold text-gray-800">{paymentData.amount}</p>
              </div>
            </motion.div>
          )}
          
          {paymentData.date && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-gray-700 text-center mb-2"
            >
              Fecha: {paymentData.date}
            </motion.p>
          )}
          
          {paymentData.sessionId && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-500 text-sm text-center mb-6"
            >
              ID de transacción: {paymentData.sessionId.substring(0, 16)}...
            </motion.p>
          )}
        </>
      )}
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="text-gray-600 text-center max-w-md mb-8"
      >
        Tu pago ha sido procesado exitosamente. Serás redirigido a la página principal en unos segundos.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={() => router.push('/')}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Volver al inicio
      </motion.button>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}

