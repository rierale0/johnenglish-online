import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { format, addDays } from 'date-fns';
import { getAuthenticatedClient } from '@/lib/google-calendar/auth.js';

async function GET(request: Request) {
  try {
    console.log('Request method:', request.method);

    const auth = await getAuthenticatedClient();
    const calendar = google.calendar({ version: 'v3', auth });
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json({ error: 'Missing start or end date' }, { status: 400 });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    const freeBusyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: process.env.GOOGLE_CALENDAR_ID }],
        timeZone: 'Europe/Madrid', 
      },
    });

    if (!freeBusyResponse.data.calendars) {
      throw new Error('No calendar data received');
    }

    const availability: Record<string, Record<string, { available: boolean }>> = {};
    const busySlots = freeBusyResponse.data.calendars[process.env.GOOGLE_CALENDAR_ID!]?.busy || [];

    console.log('Busy slots:', busySlots);

    const workingHours = {
      start: 9,
      end: 22,
      duration: 60,
    };

    for (let date = new Date(startDate); date <= endDate; date = addDays(date, 1)) {
      const dateKey = format(date, 'yyyy-MM-dd');
      availability[dateKey] = {};

      for (let hour = workingHours.start; hour < workingHours.end; hour++) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + workingHours.duration);

        const isSlotBusy = busySlots.some((busy) => {
          if (busy.start && busy.end) {
            const busyStart = new Date(busy.start);
            const busyEnd = new Date(busy.end);
            return (
              (slotStart >= busyStart && slotStart < busyEnd) ||
              (slotEnd > busyStart && slotEnd <= busyEnd) ||
              (slotStart <= busyStart && slotEnd >= busyEnd)
            );
          }
          return false;
        });

        availability[dateKey][timeSlot] = { available: !isSlotBusy };
      }
    }

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch availability',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export { GET };