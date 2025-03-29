"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, addDays, eachDayOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { ClassPrices, SelectedClass, classPrices, getClassTypeColor } from '@/types/class'
import { Loader2 } from "lucide-react"

type DayAvailability = {
  [hour: string]: {
    available: boolean;
  }
}

type WeekAvailability = {
  [date: string]: DayAvailability;
}


export function ClassScheduler({ 
  onSelectionChange 
}: { 
  onSelectionChange?: (selected: SelectedClass[], total: number) => void 
}) {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(today);
  const [selectedClassType, setSelectedClassType] = useState<string | null>('individual');
  const [weekAvailability, setWeekAvailability] = useState<WeekAvailability>({});
  const [selectedSlots, setSelectedSlots] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const weekStart = currentWeek;
  const weekEnd = addDays(weekStart, 6);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Fix: Only disable previous week button if we're already at the current week
  const isPreviousWeekDisabled = format(weekStart, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

  // Fetch availability data


  const fetchAvailability = async (startDate: Date) => {
    setIsLoading(true);
    try {
      const endDate = addDays(startDate, 20);
      const response = await fetch(
        `/api/availability?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch availability');
      
      const data = await response.json();
      setWeekAvailability(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
      // Set empty availability when fetch fails
      setWeekAvailability({});
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect to use the fetchAvailability function
  React.useEffect(() => {
    const currentWeekKey = format(weekStart, 'yyyy-MM-dd');
    
    if (format(weekStart, 'yyyy-MM-dd') !== currentWeekKey) {
      setCurrentWeek(new Date(currentWeekKey));
      fetchAvailability(weekStart);
    } else if (Object.keys(weekAvailability).length === 0) {
      fetchAvailability(weekStart);
    }
  }, [weekStart]);

  // Previous week now goes back 7 days, but not before today
  const handlePreviousWeek = () => {
    const newDate = addDays(currentWeek, -7);
    // Don't go before today
    if (format(newDate, 'yyyy-MM-dd') >= format(today, 'yyyy-MM-dd')) {
      setCurrentWeek(newDate);
    } else {
      // If going back would put us before today, just go to today
      setCurrentWeek(today);
    }
  }

  // Next week now means "next 7 days" from the current view
  const handleNextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7));
  }

  // Handle slot selection
  const handleSlotSelect = (date: string, hour: string) => {
    if (!selectedClassType) return;
    
    const slotKey = `${date}-${hour}`;
    
    setSelectedSlots(prev => {
      // If already selected, deselect it
      if (prev[slotKey] === selectedClassType) {
        const newSelected = {...prev};
        delete newSelected[slotKey];
        return newSelected;
      }
      // Otherwise select it with current class type
      return {
        ...prev,
        [slotKey]: selectedClassType
      };
    });
  };

  // Notificar cambios en las selecciones
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedClasses = Object.entries(selectedSlots).map(([key, type]) => {
        // The problem is here - we're not splitting correctly
        // The key format is "yyyy-MM-dd-HH:mm", not just "date-hour"
        const dateParts = key.split('-');
        const hour = dateParts.pop(); // Get the last part (hour)
        const date = dateParts.join('-'); // Rejoin the date parts
        
        // console.log('Enviando fecha correcta:', date, typeof date, 'hora:', hour);
        return { date, hour, type };
      });
      
      // Log the selected classes before sending them to the parent
     // console.log('Selected classes to send:', selectedClasses);
      
      // Calcular subtotal
      const subtotal = selectedClasses.reduce((sum, cls) => {
        return sum + classPrices[cls.type as keyof ClassPrices].price;
      }, 0);
      
      // Aplicar descuentos según cantidad de clases
      let total = subtotal;
      let discount = 0;
      
      if (selectedClasses.length >= 10) {
        // 20% de descuento para 10 o más clases
        discount = subtotal * 0.2;
      } else if (selectedClasses.length >= 5) {
        // 10% de descuento para 5 o más clases
        discount = subtotal * 0.1;
      }
      
      total = subtotal - discount;
      
      onSelectionChange(selectedClasses as SelectedClass[], total);
    }
  }, [selectedSlots, onSelectionChange]);

  // Get color scheme based on class type
  const getClassTypeStyles = (type: string) => {
    switch(type) {
      case 'individual':
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-500',
          text: 'text-blue-700',
          tag: 'bg-blue-500'
        };
      case 'grupal':
        return {
          bg: 'bg-green-100',
          border: 'border-green-500',
          text: 'text-green-700',
          tag: 'bg-green-500'
        };
      case 'especializada':
        return {
          bg: 'bg-purple-100',
          border: 'border-purple-500',
          text: 'text-purple-700',
          tag: 'bg-purple-500'
        };
      default:
        return {
          bg: '',
          border: '',
          text: '',
          tag: ''
        };
    }
  };

  return (
    <Card className="card w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Selecciona tus clases</CardTitle>
        <div className="flex items-center gap-1 border-[1px] border-[#353259] rounded-md">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handlePreviousWeek}
            disabled={isPreviousWeekDisabled}
            className={`hover:bg-[#4F518C] ${isPreviousWeekDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="px-4 py-2 font-light">
            {format(weekStart, "d MMM", { locale: es })} - {format(weekEnd, "d MMM yyyy", { locale: es })}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleNextWeek}
            className="hover:bg-[#4F518C]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Tipo de clase</h3>
          <div className="flex justify-start">
            <Button
              variant="outline"
              className={`h-16 w-40 ${
                selectedClassType === 'individual' 
                ? 'bg-blue-100 border-blue-500 text-blue-700' 
                : 'hover:bg-blue-50 hover:border-blue-300'
              }`}
              onClick={() => setSelectedClassType('individual')}
            >
              <div>
                <div>Individual</div>
                <div className="text-sm opacity-75">{classPrices.individual.price} {classPrices.individual.currency}</div>
              </div>
            </Button>
            {/* Other class type buttons */}
          </div>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-[#7FDEFF] animate-spin mb-2" />
              <p className="text-sm text-gray-300">Cargando horarios disponibles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* Display the actual day names for the 7 days we're showing */}
              {weekDays.map((day) => (
                <div key={day.toString()} className="text-center font-medium text-sm text-gray-300">
                  {format(day, 'EEE', { locale: es }).toUpperCase()}
                </div>
              ))}
              
              {weekDays.map((day, dayIndex) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayAvailability = weekAvailability[dateKey] || {};
                const isWeekend = day.getDay() === 0 || day.getDay() === 6; // 0 is Sunday, 6 is Saturday
                
                // Filter available time slots
                const availableSlots = isWeekend ? [] : Object.entries(dayAvailability)
                  .filter(([_, data]) => data.available)
                  .sort(([hourA], [hourB]) => hourA.localeCompare(hourB));
                
                return (
                  <div key={`${dateKey}-${dayIndex}`} className="text-center">
                    <div className={`mb-2 font-medium ${isWeekend ? 'text-gray-400' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {isWeekend ? (
                        <div className="text-xs text-gray-400 py-2">
{window.innerWidth <= 768 ? "N/D" : "No disponible"}
                        </div>
                      ) : availableSlots.length > 0 ? (
                        availableSlots.map(([hour, data], hourIndex) => {
                          const slotKey = `${dateKey}-${hour}`;
                          const isSelected = slotKey in selectedSlots;
                          const classType = selectedSlots[slotKey];
                          const styles = isSelected ? getClassTypeStyles(classType) : null;
                          
                          return (
                            <Button
                              key={`${slotKey}-${hourIndex}`}
                              variant="outline"
                              size="sm"
                              disabled={!selectedClassType || !data.available}
                              onClick={() => handleSlotSelect(dateKey, hour)}
                              className={`text-gray-200 font-light bg-[#4F518C] border-none w-full text-xs py-1 relative ${
                                isSelected 
                                  ? `${styles?.bg} ${styles?.border} ${styles?.text}`
                                  : selectedClassType 
                                    ? 'hover:bg-gray-100 cursor-pointer' 
                                    : 'opacity-50'
                              }`}
                            >
                              {hour}
                              {isSelected}
                              
                            </Button>
                          );
                        })
                      ) : (
                        <div key={`no-slots-${dateKey}`} className="text-xs text-gray-400 py-2">
                          No hay horas disponibles
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}