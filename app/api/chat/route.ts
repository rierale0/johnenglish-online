import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = 'asst_0WiiRLwVEtBVy2jzbGZeRrU0';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, isNewChat } = body;
    let { chatId, threadId } = body;
    let title = 'New Chat';

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

    if (isNewChat || !threadId) {
        const thread = await openai.beta.threads.create();
        threadId = thread.id;
    }

    let chatRef;
    if (isNewChat) {
        chatRef = await adminDb.collection('users').doc(uid).collection('chats').add({
            title: 'New Chat',
            createdAt: FieldValue.serverTimestamp(),
            threadId: threadId,
        });
        chatId = chatRef.id;
    } else {
        chatRef = adminDb.collection('users').doc(uid).collection('chats').doc(chatId);
    }

    // Crear el mensaje del usuario
    await chatRef.collection('messages').add({ 
      role: 'user', 
      content: message, 
      timestamp: FieldValue.serverTimestamp() 
    });

    const encoder = new TextEncoder();
    let fullResponse = '';
    let currentMessage = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Crear mensaje en el thread
          await openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: message,
          });

          // Iniciar el run con stream
          const runStream = await openai.beta.threads.runs.createAndStream(threadId, {
            assistant_id: assistantId,
          });

          // Manejar el stream en tiempo real
          for await (const chunk of runStream) {
            if (chunk.event === 'thread.message.delta') {
              const contentBlock = chunk.data?.delta?.content?.[0];
              let delta: string | undefined;
              if (contentBlock?.type === 'text' && 'text' in contentBlock) {
                delta = (contentBlock.text as { value: string }).value;
              }
              if (delta) {
                controller.enqueue(encoder.encode(delta));
                currentMessage += delta;
              }
            } else if (chunk.event === 'thread.run.failed') {
              console.error('Run failed:', chunk.data);
              controller.error(new Error('The run failed.'));
              break; 
            } else if (chunk.event === 'thread.run.completed') {
              fullResponse = currentMessage;

              // Guardar el mensaje completo en Firestore
              await chatRef.collection('messages').add({
                role: 'assistant',
                content: fullResponse,
                timestamp: FieldValue.serverTimestamp()
              });

              if (isNewChat) {
                // Generar título al final
                try {
                  const titleResponse = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [
                      { role: 'user', content: message },
                      { role: 'assistant', content: fullResponse },
                      { role: 'user', content: 'Generate a short, descriptive title for this conversation.' }
                    ]
                  });
                  
                  title = titleResponse.choices[0].message.content?.replace(/"/g, '') || 'New Chat';
                  await chatRef.update({ title });
                } catch (titleError) {
                  console.error("Error generating title:", titleError);
                  // No se rompe el stream, solo se loguea el error
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'x-chat-id': chatId,
        'x-thread-id': threadId,
        'x-chat-title': title,
      }
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}