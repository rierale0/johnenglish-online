"use client";

import { useState, FormEvent, useEffect, useRef, KeyboardEvent, useCallback } from 'react';
import { useAuth } from '@/app/(firebase auth)/context/AuthContext';
import { db } from '@/lib/firebase/firebase-client';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Send, Settings, HelpCircle, User, Plus, Share2, Trash2, Download, MoreHorizontal, Edit } from 'lucide-react';
import Welcome from '@/components/eve/Welcome';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: any; // Firestore timestamp
}

interface Chat {
  id: string;
  title: string;
  threadId: string;
  createdAt?: any; // Firestore timestamp
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="max-w-lg rounded-lg px-4 py-2 bg-gray-700">
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
      </div>
    </div>
  </div>
);

// Fade animation CSS (puedes ponerlo en tu archivo global de estilos si prefieres)
const fadeStyle = `
@keyframes fadeUp {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-40px); }
}
.fade-up {
  animation: fadeUp 0.5s forwards;
}
`;

export default function ChatPage() {
  const { user, loading } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newChatTitle, setNewChatTitle] = useState<string>('');
  const [confirmDeleteChatId, setConfirmDeleteChatId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Ref para el contenedor de mensajes
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  

  // Effect to auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputValue]);

  // Effect to listen for messages in the active chat
  useEffect(() => {
    if (chat && user) {
      const q = query(
        collection(db, `users/${user.uid}/chats/${chat.id}/messages`), 
        orderBy('timestamp', 'asc')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chatMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          chatMessages.push({
            role: data.role,
            content: data.content,
            timestamp: data.timestamp,
          });
        });
        setMessages(chatMessages);
      }, (error) => {
        console.error('Error fetching messages:', error);
      });
      
      return () => unsubscribe();
    }
  }, [chat, user]);

  useEffect(() => {
    if (selectedChatId && userChats.length > 0) {
      const foundChat = userChats.find(c => c.id === selectedChatId);
      setChat(foundChat || null);
      setMessages([]);
    } else if (userChats.length === 0) {
      setChat(null);
      setMessages([]);
    }
  }, [selectedChatId, userChats]);
  

  // Effect to load all chats for the user and manage selected chat
  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, `users/${user.uid}/chats`), 
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chatsData: Chat[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Chat[];
        setUserChats(chatsData);

        // Solo seleccionar el primer chat si no estamos creando uno nuevo
        if (!isCreatingNewChat && (!selectedChatId || !chatsData.some(c => c.id === selectedChatId))) {
          if (chatsData.length > 0) {
            setSelectedChatId(chatsData[0].id);
          } else {
            setSelectedChatId(null);
          }
        }

        // Si no hay chats, mostrar bienvenida y modo nuevo chat
        if (chatsData.length === 0) {
          setIsCreatingNewChat(true);
          setShowWelcome(true);
          setChat(null);
          setMessages([]);
        }
      }, (error) => {
        console.error('Error fetching chats:', error);
      });
      
      return () => unsubscribe();
    }
  }, [user, isCreatingNewChat]);

  // Cuando se crea el primer mensaje, ya no estamos creando un nuevo chat
  useEffect(() => {
    if (chat) {
      setIsCreatingNewChat(false);
      setShowWelcome(false);
    }
  }, [chat]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isSubmitting) return;

    const message = inputValue.trim();
    setInputValue('');
    setIsSubmitting(true);

    const newUserMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(!chat 
          ? { message, isNewChat: true }
          : { chatId: chat.id, message, threadId: chat.threadId }
        ),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let agentContent = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const delta = new TextDecoder().decode(value);
          agentContent += delta;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = agentContent;
            return newMessages;
          });
        }
      } finally {
        reader.releaseLock();
      }

      // Actualizar chat si es nuevo
      if (!chat) {
        const chatId = response.headers.get('x-chat-id');
        const threadId = response.headers.get('x-thread-id');
        const title = response.headers.get('x-chat-title');
        if (chatId && threadId) {
          setChat({ id: chatId, title: title || 'New Chat', threadId });
          setSelectedChatId(chatId);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setInputValue(message);
      alert(`Error sending message: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [chat, inputValue, isSubmitting]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleRenameChat = async (chatId: string) => {
    if (!user || !newChatTitle.trim()) {
      setEditingChatId(null);
      setNewChatTitle('');
      return;
    }
    try {
      const chatRef = doc(db, `users/${user.uid}/chats/${chatId}`);
      await updateDoc(chatRef, {
        title: newChatTitle.trim(),
      });
      setEditingChatId(null);
      setNewChatTitle('');
    } catch (error) {
      console.error('Error renaming chat:', error);
      // You might want to show an error toast here
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!user) return;
    try {
      const chatRef = doc(db, `users/${user.uid}/chats/${chatId}`);
      await deleteDoc(chatRef);
      setConfirmDeleteChatId(null);
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      // You might want to show an error toast here
    }
  };

  const createNewChat = () => {
    setIsCreatingNewChat(true);
    setSelectedChatId(null);
    setChat(null);
    setMessages([]);
    setSidebarOpen(false);
    setShowWelcome(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-xl">Please log in to use the chat.</div>
      </div>
    );
  }

  return (
    <>
      {/* Inyecta el CSS de la animación fade */}
      <style>{fadeStyle}</style>
      {confirmDeleteChatId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this chat? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDeleteChatId(null)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteChat(confirmDeleteChatId)}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative flex h-screen bg-gray-900 text-white">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-gray-800 p-4 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 z-20`}>
        <div className="flex flex-col h-full">
          <button 
            onClick={createNewChat} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4 flex items-center justify-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>New Chat</span>
          </button>
          
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {userChats.map((c) => (
                <li 
                  key={c.id} 
                  className={`group relative p-2 rounded flex items-center justify-between space-x-2 transition-colors ${
                    selectedChatId === c.id ? 'bg-blue-700 hover:bg-blue-600' : 'hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setSelectedChatId(c.id);
                    setSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                >
                  {editingChatId === c.id ? (
                    <input
                      type="text"
                      value={newChatTitle}
                      onChange={(e) => setNewChatTitle(e.target.value)}
                      onBlur={() => {
                        if (newChatTitle.trim() && newChatTitle.trim() !== c.title) {
                          handleRenameChat(c.id);
                        } else {
                          setEditingChatId(null);
                          setNewChatTitle('');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        }
                      }}
                      className="flex-grow bg-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate flex-grow">{c.title || 'New Chat'}</span>
                  )}
                  
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent chat selection
                        setEditingChatId(c.id);
                        setNewChatTitle(c.title || 'New Chat');
                      }}
                      className="p-1 rounded hover:bg-gray-600"
                      title="Rename chat"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent chat selection
                        setConfirmDeleteChatId(c.id);
                      }}
                      className="p-1 rounded hover:bg-gray-600"
                      title="Delete chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto border-t border-gray-700 pt-4">
            <ul className="space-y-2">
              <li className="p-2 rounded hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-colors">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </li>
              <li className="p-2 rounded hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-colors">
                <HelpCircle className="h-5 w-5" />
                <span>Help</span>
              </li>
              <li className="p-2 rounded hover:bg-gray-700 cursor-pointer flex items-center space-x-2 transition-colors">
                <User className="h-5 w-5" />
                <span>My Profile</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="bg-gray-800 p-4 shadow-md flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center min-w-0">
            <button 
              className="md:hidden mr-4 p-2 hover:bg-gray-700 rounded-full transition-colors" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold truncate">{chat?.title || 'New Chat'}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 hover:bg-gray-700 rounded-full transition-colors" 
              aria-label="Share chat"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button 
              className="p-2 hover:bg-gray-700 rounded-full transition-colors" 
              aria-label="Delete chat"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button 
              className="p-2 hover:bg-gray-700 rounded-full transition-colors" 
              aria-label="Download chat"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-6">
          {showWelcome ? (
            <Welcome />
          ) : (
          <div
            ref={messagesContainerRef}
            className="max-w-4xl mx-auto w-full flex flex-col"
            style={{ minHeight: '60vh', position: 'relative' }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div className={`max-w-lg rounded-lg px-4 py-2 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            ))}
            {isSubmitting && <TypingIndicator />}
          </div>
          )}
        </main>

        {/* Input Footer */}
        <footer className="p-4 border-t border-gray-700">
          <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 pr-16 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={1}
              disabled={isSubmitting}
              maxLength={4000}
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
              disabled={!inputValue.trim() || isSubmitting}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </footer>
      </div>
    </div>
    </>
  );
}