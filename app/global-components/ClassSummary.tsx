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
      // console.log('Fecha recibida en ClassSummary:', dateStr, typeof dateStr);
      
      // Handle ISO format dates (yyyy-MM-dd)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const date = parseISO(dateStr);
        // console.log('Fecha parseada:', date, date.toISOString());
        if (!isNaN(date.getTime())) {
          const formatted = format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
          // console.log('Fecha formateada:', formatted);
          return formatted;
        }
      }
      
      // Try parsing with different formats if the standard approach fails
      const date = new Date(dateStr);
      // console.log('Fecha parseada con constructor Date:', date, date.toISOString());
      if (!isNaN(date.getTime())) {
        return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
      }
      
      // If all parsing attempts fail, return a more user-friendly message
      return "Fecha no disponible";
    } catch (_) {
      // console.error('Error al formatear fecha:', dateStr, error);
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

  const getClassTypeColor = (type: string) => {
    switch(type) {
      case 'individual': return 'bg-blue-200 text-blue-800';
      case 'grupal': return 'bg-green-200 text-green-800';
      case 'especializada': return 'bg-purple-200 text-purple-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  

  return (
    <div className="card w-full max-w-4xl rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Resumen de Clases Seleccionadas
      </h2>
      
      {selectedClasses.length === 0 ? (
        <div className="p-8 rounded-md text-center text-gray-500">
          No has seleccionado ninguna clase todavía
        </div>
      ) : (
        <div className="space-y-4">
          {/* Lista de clases seleccionadas - Versión móvil */}
          <div className="md:hidden space-y-4">
            {selectedClasses.map((cls, index) => (
              <div key={index} className="border border-[#353259] rounded-md p-3 hover:bg-[#4F518C]">
                <div className="flex justify-between items-center mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getClassTypeColor(cls.type)}`}>
                    {getClassTypeName(cls.type)}
                  </span>
                  <span className="font-bold">{getClassPrice(cls.type)} EUR</span>
                </div>
                <div className="text-sm text-[#C8C9F7]">{formatDate(cls.date)}</div>
                <div className="text-sm">{cls.hour}</div>
              </div>
            ))}
            
            {/* Resumen de precios para móvil */}
            <div className="border border-[#353259] rounded-md p-3 space-y-2">
              {selectedClasses.length >= 5 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Subtotal ({selectedClasses.length} clases)</span>
                    <span className="text-sm">
                      {selectedClasses.reduce((sum, cls) => sum + getClassPrice(cls.type), 0)} EUR
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-sm">
                      Descuento {selectedClasses.length >= 10 ? '(20%)' : '(10%)'}
                    </span>
                    <span className="text-sm">
                      -{(selectedClasses.reduce((sum, cls) => sum + getClassPrice(cls.type), 0) - total).toFixed(2)} EUR
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-[#353259]">
                <span className="text-sm font-medium">Total</span>
                <span className="text-sm font-bold">{total} EUR</span>
              </div>
            </div>
          </div>
          
          {/* Lista de clases seleccionadas - Versión desktop */}
          <div className="hidden md:block border rounded-md border-[#353259] text-gray-100">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Fecha</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Hora</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Tipo</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#353259]">
                {selectedClasses.map((cls, index) => (
                  <tr key={index} className="hover:bg-[#4F518C]">
                    <td className="px-4 py-3 text-sm text-[#C8C9F7]">
                      {formatDate(cls.date)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {cls.hour}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getClassTypeColor(cls.type)}`}>
                        {getClassTypeName(cls.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {getClassPrice(cls.type)} EUR
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="">
                {selectedClasses.length >= 5 && (
                  <>
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-sm font-medium text-right">
                        Subtotal <span className="text-xs ml-1">({selectedClasses.length} clases)</span>
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        {selectedClasses.reduce((sum, cls) => sum + getClassPrice(cls.type), 0)} EUR
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-sm font-medium text-green-600 text-right">
                        Descuento {selectedClasses.length >= 10 ? '(20%)' : '(10%)'} 
                        <span className="text-xs ml-1">
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
                  <td colSpan={3} className="px-4 py-3 text-sm font-medium text-right">
                    Total
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-right">
                    {total} EUR
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Botón de pago */}
          <div className="mt-6 flex justify-center md:justify-end">
            <Button 
              className="w-full md:w-auto bg-[#7FDEFF] text-[#242239] px-6 py-2 rounded-md hover:bg-[#4F518C] hover:text-[white] transition-colors"
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