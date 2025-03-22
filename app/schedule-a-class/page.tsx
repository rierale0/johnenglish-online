"use client"

import React, { useState, useCallback } from 'react';
import { ClassScheduler } from '@/components/ClassScheduler';
import { ClassSummary } from '@/components/ClassSummary';

type SelectedClass = {
  date: string;
  hour: string;
  type: string;
}

export default function ScheduleClass() {
  const [selectedClasses, setSelectedClasses] = useState<SelectedClass[]>([]);
  const [total, setTotal] = useState(0);

  // Use useCallback to stabilize the function reference
  const handleSelectionChange = useCallback((classes: SelectedClass[], newTotal: number) => {
    setSelectedClasses(classes);
    setTotal(newTotal);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-blue-100 to-white">
      {/* Header */}
      <h1 className="text-4xl font-bold text-blue-900 mb-8">
        Agenda tus clases
      </h1>

      {/* Class Scheduling System */}
      <div className="w-full max-w-4xl mb-8">
        <ClassScheduler onSelectionChange={handleSelectionChange} />
      </div>

      {/* Selected Classes and Payment Summary */}
      <ClassSummary selectedClasses={selectedClasses} total={total} />
    </main>
  );
}