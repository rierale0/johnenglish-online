import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return new NextResponse('Bad Request: No message provided', { status: 400 });
    }

    const cookieStore = await cookies();
    const idToken = cookieStore.get('authToken')?.value;

    if (!idToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 1. Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });
    const aiResponse = completion.choices[0].message.content;

    // 2. Generate title
    const titleCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: message },
            { role: 'assistant', content: aiResponse || '' },
            { role: 'user', content: 'Generate a short, descriptive title for this conversation.' },
        ],
    });
    const title = titleCompletion.choices[0].message.content?.replace(/"/g, '') || 'New Chat';

    // 3. Create new chat in Firestore
    const chatRef = await adminDb.collection('users').doc(uid).collection('chats').add({
        title,
        createdAt: FieldValue.serverTimestamp(),
    });

    // 4. Save initial messages
    const messagesRef = chatRef.collection('messages');
    await messagesRef.add({ role: 'user', content: message, timestamp: FieldValue.serverTimestamp() });
    await messagesRef.add({ role: 'assistant', content: aiResponse, timestamp: FieldValue.serverTimestamp() });

    return NextResponse.json({ 
        chatId: chatRef.id, 
        title, 
        response: aiResponse 
    });

  } catch (error) {
    console.error('Error in generate-title API route:', error);
    if (error.code === 'auth/id-token-expired') {
        return new NextResponse('Token expired', { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}