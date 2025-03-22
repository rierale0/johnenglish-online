"use client"

import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { classPrices, SelectedClass } from "@/types/class";
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// Use environment variable for the publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

type ClassSummaryProps = {
  selectedClasses: SelectedClass[];
  total: number;
}

export function ClassSummary({ selectedClasses, total }: ClassSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle Stripe checkout
  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Create a checkout session on your server
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classes: selectedClasses,
          total: total
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating checkout session');
      }
      
      const session = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }
      
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      
      if (error) {
        console.error('Error redirecting to checkout:', error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error during checkout process:', error);
      // You could add a UI notification here
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to process payment'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateStr: string) => {
    try {
      // More detailed logging
      console.log('Fecha recibida en ClassSummary:', dateStr, typeof dateStr);
      
      // Handle ISO format dates (yyyy-MM-dd)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const date = parseISO(dateStr);
        console.log('Fecha parseada:', date, date.toISOString());
        if (!isNaN(date.getTime())) {
          const formatted = format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
          console.log('Fecha formateada:', formatted);
          return formatted;
        }
      }
      
      // Try parsing with different formats if the standard approach fails
      const date = new Date(dateStr);
      console.log('Fecha parseada con constructor Date:', date, date.toISOString());
      if (!isNaN(date.getTime())) {
        return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
      }
      
      // If all parsing attempts fail, return a more user-friendly message
      return "Fecha no disponible";
    } catch (error) {
      console.error('Error al formatear fecha:', dateStr, error);
      return "Fecha no disponible";
    }
  };

  // Obtener el nombre completo del tipo de clase
  const getClassTypeName = (type: string) => {
    switch(type) {
      case 'individual': return 'Individual';
      case 'grupal': return 'Grupal';
      case 'especializada': return 'Especializada';
      default: return type;
    }
  };

  // Obtener el precio de la clase
  const getClassPrice = (type: string) => {
    switch(type) {
      case 'individual': return classPrices.individual.price;
      case 'grupal': return classPrices.grupal.price;
      case 'especializada': return classPrices.especializada.price;
      default: return 0;
    }
  };

  // Obtener el color del tipo de clase
  const getClassTypeColor = (type: string) => {
    switch(type) {
      case 'individual': return 'bg-blue-500';
      case 'grupal': return 'bg-green-500';
      case 'especializada': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">
        Resumen de Clases Seleccionadas
      </h2>
      
      {selectedClasses.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-md text-center text-gray-500">
          No has seleccionado ninguna clase todavía
        </div>
      ) : (
        <div className="space-y-4">
          {/* Lista de clases seleccionadas */}
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Fecha</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Hora</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Tipo</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedClasses.map((cls, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(cls.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {cls.hour}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${getClassTypeColor(cls.type)}`}>
                        {getClassTypeName(cls.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      {getClassPrice(cls.type)} EUR
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                {selectedClasses.length >= 5 && (
                  <>
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-700 text-right">
                        Subtotal <span className="text-xs text-gray-500 ml-1">({selectedClasses.length} clases)</span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-right">
                        {selectedClasses.reduce((sum, cls) => sum + getClassPrice(cls.type), 0)} EUR
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-sm font-medium text-green-600 text-right">
                        Descuento {selectedClasses.length >= 10 ? '(20%)' : '(10%)'} 
                        <span className="text-xs text-gray-500 ml-1">
                          {selectedClasses.length >= 10 
                            ? '(Por reservar 10+ clases)' 
                            : '(Por reservar 5+ clases)'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-green-600 text-right">
                        -{(selectedClasses.reduce((sum, cls) => sum + getClassPrice(cls.type), 0) - total).toFixed(2)} EUR
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-700 text-right">
                    Total
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                    {total} EUR
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Botón de pago */}
          <div className="mt-6 flex justify-end">
            <Button 
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              disabled={selectedClasses.length === 0 || isLoading}
              onClick={handleCheckout}
            >
              {isLoading ? 'Procesando...' : 'Proceder al Pago'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}