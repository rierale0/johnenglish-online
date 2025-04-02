'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Suspense } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'

interface PaymentData {
  sessionId?: string;
  customerName?: string;
  amount?: string;
  email?: string;
  productName?: string;
  date?: string;
  lineItems?: any[]; // Add this line to store line items
}

const webhookUrl = process.env.PAYMENT_SUCCESS_WEBHOOK_URL;

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
          
          // If we have a payment intent, we can fetch more details
          
          if (sessionId) {
            // Fetch payment intent details
            return fetch(`/api/payment-intents/${sessionId}`)
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
      const response = await fetch('/api/payment-webhook', {
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
        console.log('Successfully sent data to webhook');
      } else {
        console.error('Failed to send data to webhook:', await response.text());
      }
    } catch (error) {
      console.error('Error sending data to webhook:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center from-green-50 to-white p-4">
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
        className="text-4xl font-bold text-white mb-4 text-center"
      >
        ¡Gracias por tu compra!
      </motion.h1>
      
      {isLoading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-200 mb-4"
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
              className="text-gray-200 text-3xl text-center font-medium mb-2"
            >
              {paymentData.customerName}
            </motion.p>
          )}
          
          {/* Display detailed line items */}
          {paymentData.lineItems && paymentData.lineItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="w-full max-w-md bg-gray-200 mt-4 rounded-lg shadow-sm p-4 mb-4"
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
                        <p className="font-regular text-gray-800">{item.description}</p>
                        
                        
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
              className="text-gray-200 text-center mb-2"
            >
              Fecha: {paymentData.date}
            </motion.p>
          )}
          
          {paymentData.sessionId && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-300 font-light text-[10px] text-center mb-6"
            >
              ID de transacción: {paymentData.sessionId}
            </motion.p>
          )}
        </>
      )}
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="text-gray-300 text-3xl text-center font-regular max-w-md mt-8 mb-4"
      >
        Tu pago se ha procesado con éxito.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="text-gray-300 text-start font-light max-w-md mb-8"
      >
        ✉️ A continuación, recibirás un correo electrónico con los detalles de tu compra.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.68 }}
        className="bg-[#4F518C] rounded-lg shadow-md p-4 mb-8 flex flex-col items-center max-w-md w-full"
      >
        <div className="flex items-center mb-3">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-green-500 flex-shrink-0">
            <img 
              src="/home/john-profpic.jpg" 
              alt="John English" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          <p className="text-gray-200 font-light">
            ¿Tienes alguna pregunta? Puedes ponerte en contacto conmigo directamente por WhatsApp.
          </p>
        </div>
        <a 
          href="https://wa.me/+34613686939" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-[#65B38A] hover:bg-[#4DA878] text-white py-2 px-4 rounded-lg w-full transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Contactar por WhatsApp
        </a>
      </motion.div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header/>
      <PaymentSuccessContent />
      <Footer/>
    </Suspense>
  )
}

