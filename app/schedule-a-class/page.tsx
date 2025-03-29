"use client";

import React, { useState, useCallback } from "react";
import { ClassScheduler } from "@/app/components/ClassScheduler";
import { ClassSummary } from "@/app/components/ClassSummary";
import Header from "../components/Header";
import Footer from "../components/Footer";

type SelectedClass = {
  date: string;
  hour: string;
  type: string;
};

export default function ScheduleClass() {
  const [selectedClasses, setSelectedClasses] = useState<SelectedClass[]>([]);
  const [total, setTotal] = useState(0);

  // Use useCallback to stabilize the function reference
  const handleSelectionChange = useCallback(
    (classes: SelectedClass[], newTotal: number) => {
      setSelectedClasses(classes);
      setTotal(newTotal);
    },
    []
  );

  return (
    <div>
      
      <Header />
      <main className="flex min-h-screen flex-col items-center p-8">
      
        {/* Header */}
        <h1 className="text-4xl text-white font-bold mb-8 mt-8">
          🗓️ Agenda tus clases
        </h1>

        {/* Three-column layout: 15% - 70% - 15% */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Left column - empty for balance */}
          <div className="hidden md:block md:col-span-2"></div>
          
          {/* Center column - main content */}
          <div className="col-span-12 md:col-span-8">
            {/* Class Scheduling System */}
            <div className="w-full mb-8">
              <ClassScheduler onSelectionChange={handleSelectionChange} />
            </div>
            
            {/* Selected Classes and Payment Summary */}
            <ClassSummary selectedClasses={selectedClasses} total={total} />
          </div>
          
          {/* Right column - discount aside */}
          <div className="col-span-12 md:col-span-2 flex flex-col items-center">
            <aside className="w-full bg-blue-50 p-4 rounded-lg shadow-md border border-blue-200 text-blue-800 mt-4 md:mt-0 sticky top-4">
              <h3 className="font-bold text-lg mb-2">🎁 ¡Descuentos Especiales! </h3>
              <div className="mb-2">
                <span className="font-semibold">5 clases:</span> 10% de descuento
              </div>
              <div>
                <span className="font-semibold">10+ clases:</span> 20% de descuento
              </div>
              <div className="mt-3 text-sm">
                ✨ Los descuentos se aplican automáticamente al agendar.
              </div>
            </aside>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
