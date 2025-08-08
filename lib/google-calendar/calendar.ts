import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface CalendarEvent {
  id: string;
  start: string;
  end: string;
  summary: string;
  description?: string;
}

// const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export async function getCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  try {
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return (response.data.items || []).map((event): CalendarEvent | null => {
      if (!event.id || !event.start || !event.end) {
        return null;
      }

      return {
        id: event.id,
        start: event.start.dateTime || event.start.date || '',
        end: event.end.dateTime || event.end.date || '',
        summary: event.summary || 'No title',
        description: event.description || undefined
      };
    }).filter((event): event is CalendarEvent => event !== null);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}