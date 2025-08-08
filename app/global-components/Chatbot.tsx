"use client"

import React, { useState, useEffect, KeyboardEvent } from "react";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import {
  ArrowRightIcon,
  PaperPlaneIcon,
  DividerHorizontalIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";

// Add UUID generation utility
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Cookie utility functions
const setCookie = (name: string, value: string, minutes: number) => {
  const date = new Date();
  date.setTime(date.getTime() + (minutes * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const getCookie = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

interface ChatbotProps {
  logoPath?: string;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  buttonIcon?: React.ReactNode;
  ctaText?: string;
  ctaIcon?: React.ReactNode;
  inputPlaceholder?: string;
  poweredByText?: string;
  brandName?: string;
  darkMode?: boolean;
  fontFamily?: string;
  companyName?: string;
  webhookUrl?: string;
  language?: "es" | "en";
}

// Define ChatMessage interface outside the component
interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({
  logoPath = "/pycat.svg",
  title = "¿Cómo podemos ayudarte hoy?",
  subtitle = "Chatea con nosotros",
  primaryColor = "#8A4FFF",
  buttonIcon = (
    <svg
      width="22px"
      height="22px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", margin: "auto" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.5C6.75736 2.5 2.5 6.75736 2.5 12C2.5 13.5311 2.85944 14.9762 3.5 16.2578C3.75661 16.7715 3.85547 17.3835 3.69316 17.9843L3.08398 20.2578C2.96875 20.6816 3.35547 21.0684 3.77929 20.9531L6.05273 20.3438C6.65234 20.1816 7.26465 20.2793 7.77734 20.5371C9.05859 21.1777 10.5037 21.5 12 21.5C17.2426 21.5 21.5 17.2426 21.5 12C21.5 11.3496 21.4346 10.7148 21.3105 10.1016C21.2246 9.68359 21.4941 9.27734 21.9121 9.19141C22.3301 9.10547 22.7363 9.375 22.8223 9.79297C22.9668 10.5059 23.042 11.2441 23.042 12C23.042 18.0762 18.0762 23.042 12 23.042C10.2324 23.042 8.56055 22.627 7.07617 21.8848C6.85547 21.7734 6.63086 21.75 6.44141 21.8008L4.16016 22.4141C2.58789 22.832 1.16797 21.4121 1.58594 19.8398L2.19922 17.5586C2.25 17.3691 2.22656 17.1445 2.11719 16.9238C1.37109 15.4395 0.957031 13.7676 0.957031 12C0.957031 5.92383 5.92383 0.957031 12 0.957031C12.7559 0.957031 13.4941 1.0332 14.207 1.17773C14.625 1.26367 14.8945 1.66992 14.8086 2.08789C14.7227 2.50586 14.3164 2.77539 13.8984 2.68945C13.2852 2.56445 12.6504 2.5 12 2.5ZM15 5C15 2.79297 16.793 1 19 1C21.207 1 23 2.79297 23 5C23 7.20703 21.207 9 19 9C16.793 9 15 7.20703 15 5ZM19 2.5C17.6211 2.5 16.5 3.62109 16.5 5C16.5 6.37891 17.6211 7.5 19 7.5C20.3789 7.5 21.5 6.37891 21.5 5C21.5 3.62109 20.3789 2.5 19 2.5Z"
        fill="white"
        stroke="white"
        strokeWidth="0.5"
      />
    </svg>
  ),
  ctaText = "✨ Solicitar una cotización",
  ctaIcon = <ArrowRightIcon />,
  inputPlaceholder,
  poweredByText,
  brandName = "Pycat",
  darkMode = true,
  fontFamily = "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  companyName = "Pycat",
  webhookUrl = "/api/chat-webhook",
  language = "es",
}) => {
  // Define language-specific text
  const translations = {
    es: {
      inputPlaceholder: "Escribe un mensaje...",
      poweredBy: "Desarrollado por"
    },
    en: {
      inputPlaceholder: "Write a message...",
      poweredBy: "Powered by"
    }
  };

  // Use provided values or fallback to language defaults
  const localizedInputPlaceholder = inputPlaceholder || translations[language].inputPlaceholder;
  const localizedPoweredByText = poweredByText ||  translations[language].poweredBy;

  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [inputText, setInputText] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [introFading, setIntroFading] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Initialize user ID and load saved messages
  useEffect(() => {
    // Check for existing user ID in cookie
    let currentUserId = getCookie('pycat_user_id');
    
    // If no user ID exists, generate a new one and set cookie
    if (!currentUserId) {
      currentUserId = generateUUID();
      setCookie('pycat_user_id', currentUserId, 5); // 5 minutes expiration
    } else {
      // Refresh the cookie expiration
      setCookie('pycat_user_id', currentUserId, 5);
    }
    
    setUserId(currentUserId);
    
    // Load saved messages from localStorage
    const savedMessages = localStorage.getItem(`pycat_messages_${currentUserId}`);
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      setMessages(parsedMessages);
      
      // If we have saved messages, skip the intro
      if (parsedMessages.length > 0) {
        setShowIntro(false);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (userId && messages.length > 0) {
      localStorage.setItem(`pycat_messages_${userId}`, JSON.stringify(messages));
    }
  }, [messages, userId]);

  useEffect(() => {
    if (isOpen && !isEntering) {
      setIsEntering(true);
    }
  }, [isOpen, isEntering]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
    // Show scrollbar when new messages arrive
    setShowScrollbar(true);
    // Hide scrollbar after 5 seconds
    const timer = setTimeout(() => {
      setShowScrollbar(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [messages]);

  // Add a new effect to scroll to bottom when chat is opened
  useEffect(() => {
    if (isOpen && !showIntro) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, showIntro]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && window.innerWidth <= 768) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // Allow scrolling within the chat container
      const chatContainer = document.querySelector('.custom-scrollbar');
      if (chatContainer) {
        (chatContainer as HTMLElement).style.overflow = 'auto';
        (chatContainer as HTMLElement).style.height = '100%';
      }
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY.replace('-', '')) || 0);
      }
    }

    return () => {
      // Cleanup
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);



  const handleScroll = () => {
    setShowScrollbar(true);
    // Hide scrollbar after 5 seconds of inactivity
    const timer = setTimeout(() => {
      setShowScrollbar(false);
    }, 5000);
    return () => clearTimeout(timer);
  };

  const toggleChat = () => {
    if (isOpen) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsTransitioning(false);
      }, 300); // Exit transition time
    } else {
      setIsOpen(true);
      setIsEntering(true);
      // Reset the entering state after animation completes
      setTimeout(() => {
        setIsEntering(false);
      }, 100); // Entry transition time - longer for a more noticeable effect
    }
  };

  // Base font styles that will be applied to the container
  const baseFontStyles = {
    fontFamily,
  };

  // Inline styles
  const styles = {
    chatbotContainer: {
      position: "fixed" as const,
      bottom: isOpen && window.innerWidth <= 768 ? '0px' : '20px',
      right: isOpen && window.innerWidth <= 768 ? '0px' : '20px',
      zIndex: 1000,
      ...baseFontStyles,
    },
    chatButton: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: primaryColor,
      color: "white",
      border: "none",
      cursor: "pointer",
      display: isOpen ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      transition: "all 0.3s ease",
      outline: "none",
    },
    chatButtonHover: {
      transform: "scale(1.05)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
    },
    chatWindow: {
      position: "absolute" as const,
      bottom: "0",
      right: "0",
      width: isOpen && window.innerWidth <= 768 ? '100vw' : '390px',
      height: isOpen && window.innerWidth <= 768 ? '85vh' : '650px',
      backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f7",
      borderRadius: "10px",
      boxShadow: darkMode
        ? "0 5px 15px rgba(0, 0, 0, 0.4)"
        : "0 5px 15px rgba(0, 0, 0, 0.2)",
      display: "flex",
      flexDirection: "column" as const,
      overflow: "hidden",
      opacity: isTransitioning ? 0 : 1,
      transform: isTransitioning
        ? "translateY(20px)"
        : isEntering
        ? "translateY(0)"
        : "translateY(0)",
      transition: isEntering
        ? "opacity 0.5s ease, transform 0.5s ease"
        : "opacity 0.3s ease, transform 0.3s ease",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      margin: "15px 0 5px 0",
      color: darkMode ? "#ffffff" : "#000000",
    },
    subtitle: {
      fontSize: "18px",
      color: darkMode ? "#999999" : "#555555",
      margin: "0 0 30px 0",
    },
    ctaButton: {
      backgroundColor: darkMode ? "#2a2a2a" : "white",
      color: darkMode ? "#ffffff" : "#333333",
      border: "none",
      borderRadius: "8px",
      padding: "15px 20px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      textAlign: "left" as const,
      boxShadow: darkMode
        ? "0 2px 5px rgba(0, 0, 0, 0.3)"
        : "0 2px 5px rgba(0, 0, 0, 0.1)",
      margin: "20px 0",
      width: "100%",
      fontSize: "14px",
      outline: "none",
    },
    chatInput: {
      width: "100%",
      padding: "15px",
      border: darkMode ? "1px solid #333333" : "1px solid #dddddd",
      borderRadius: "8px",
      backgroundColor: darkMode ? "#2a2a2a" : "white",
      boxSizing: "border-box" as const,
      fontSize: "14px",
      position: "relative" as const,
      display: "flex",
      alignItems: "flex-end", // Changed from center to flex-end to align with bottom
      justifyContent: "space-between",
    },
    inputField: {
      border: "none",
      outline: "none",
      width: "85%",
      fontSize: "14px",
      backgroundColor: "transparent",
      color: darkMode ? "#ffffff" : "#000000",
      resize: "none" as const, // Prevent manual resizing
      maxHeight: "120px", // Maximum height before scrolling
      minHeight: "24px", // Initial height
      overflow: "auto", // Add scrollbar when exceeding maxHeight
      fontFamily, // Use the same font as the rest of the component
    },
    sendButton: {
      background: "none",
      border: "none",
      color: darkMode ? "#666666" : "#888888",
      cursor: "pointer",
      fontSize: "20px",
      marginRight: "5px",
      padding: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      borderRadius: "50%",
      outline: "none",
    },
    sendButtonHover: {
      color: primaryColor,
      transform: "scale(1.1)",
      backgroundColor: darkMode ? "#333333" : "#f0f0f0",
    },
    sendButtonActive: {
      transform: "scale(0.95)",
      color: primaryColor,
    },
    poweredBy: {
      textAlign: "center" as const,
      fontSize: "12px",
      color: darkMode ? "#666666" : "#888888",
      margin: "15px 0 5px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px"
    },
    // Agregar nuevo estilo para el contenedor de botones
    buttonContainer: {
      position: "absolute" as const,
      top: "15px",
      right: "15px",
      display: "flex",
      gap: "10px",
      zIndex: 10,
    },
    closeButton: {
      background: "none",
      border: "none",
      color: darkMode ? "#666666" : "#888888",
      fontSize: "24px",
      cursor: "pointer",
      outline: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      height: "24px",
      padding: 0,
    },
    fullscreenButton: {
      background: "none",
      border: "none",
      color: darkMode ? "#666666" : "#888888",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "color 0.2s ease",
      outline: "none",
      width: "24px",
      height: "24px",
      padding: 0,
    },
    fullscreenButtonHover: {
      color: primaryColor,
    },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Auto-resize the textarea
    e.target.style.height = "24px"; // Reset height
    const scrollHeight = e.target.scrollHeight;
    e.target.style.height = Math.min(scrollHeight, 120) + "px"; // Set new height with max limit
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && inputText.trim()) {
      e.preventDefault(); // Prevent default to avoid new line
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (inputText.trim()) {
      const userMessage: ChatMessage = {
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date().toISOString()
      };

      // Para el CTA, reemplazamos los mensajes en lugar de añadir
      if (showIntro) {
        setMessages([userMessage]);
      } else {
        setMessages((prev) => [...prev, userMessage]);
      }

      setInputText("");

      if (showIntro) {
        setIntroFading(true);
        setTimeout(() => {
          setShowIntro(false);
          setIntroFading(false);
        }, 300);
      }

      // Determinar si es un mensaje CTA
      const isCTA = userMessage.text === ctaText;

      // Show typing indicator
      setIsTyping(true);

      try {
        // Refresh the cookie expiration with each message
        setCookie('pycat_user_id', userId, 20);
        
        // Obtener información de la zona horaria y hora local
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localTime = new Date().toLocaleString();
        
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage.text,
            timestamp: new Date().toISOString(),
            userLocalTimestamp: localTime,
            userTimezone: userTimezone,
            userId: userId,
            isCTA: isCTA,
          }),
        });

        const textData = await response.text();
        let botResponseText;

        try {
          const jsonData = JSON.parse(textData);
          botResponseText = jsonData.response;
        } catch (_parseError) {
          // If it's not JSON, use the text directly
          botResponseText = textData;
        }

        // Hide typing indicator
        setIsTyping(false);

        const botResponse: ChatMessage = {
          text: botResponseText,
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        // Hide typing indicator on error
        setIsTyping(false);
        console.error("Error:", error);
        console.log("Failed to send message:", error);
      }
    }
  };

  return (
    <div style={styles.chatbotContainer}>
      {(isOpen || isTransitioning) && (
        <div
          style={{
            ...styles.chatWindow,
            ...(isEntering ? {} : {}),
          }}
        >
          <div style={styles.buttonContainer}>
            <button style={styles.closeButton} onClick={toggleChat}>
              <DividerHorizontalIcon />
            </button>
          </div>
          <div
            style={{
              padding: "16px 28px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                marginTop: "28px",
                marginBottom: "20px",
                gap: "8px",
              }}
            >
              <Image
                src={logoPath}
                alt="Logo"
                width={40}
                height={40}
                style={{ height: "auto" }}
              />
              {companyName && (
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: darkMode ? "#ffffff" : "#000000",
                  }}
                >
                  {companyName}
                </span>
              )}
            </div>

            {showIntro ? (
              <div
                style={{
                  opacity: introFading ? 0 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                <h2 style={styles.title}>{title}</h2>
                <p style={styles.subtitle}>{subtitle}</p>

                <button
                  style={styles.ctaButton}
                  onClick={async () => {
                    // Create the user message first
                    const newMessage: ChatMessage = {
                      text: ctaText,
                      isUser: true,
                      timestamp: new Date().toISOString()
                    };

                    // Start fading the intro
                    setIntroFading(true);
                    
                    // Wait for fade animation to complete before changing view
                    setTimeout(() => {
                      // Hide intro and show messages view with the user message
                      setShowIntro(false);
                      setMessages([newMessage]);
                      
                      // Show typing indicator immediately after showing the message
                      setIsTyping(true);
                      
                      // Refresh the cookie expiration
                      setCookie('pycat_user_id', userId, 20);
                      
                      // Now make the API call
                      fetch(webhookUrl, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          message: ctaText,
                          timestamp: new Date().toISOString(),
                          userId: userId,
                          isCTA: true,
                        }),
                      })
                      .then(response => {
                        if (!response.ok) {
                          throw new Error("Network response was not ok");
                        }
                        return response.text();
                      })
                      .then(textData => {
                        let botResponseText;
                        try {
                          const jsonData = JSON.parse(textData);
                          botResponseText = jsonData.response;
                        } catch (_parseError) {
                          // If it's not JSON, use the text directly
                          botResponseText = textData;
                        }
                        
                        // Hide typing indicator
                        setIsTyping(false);
                        
                        if (botResponseText) {
                          const botResponse: ChatMessage = {
                            text: botResponseText,
                            isUser: false,
                            timestamp: new Date().toISOString()
                          };
                          setMessages(prev => [...prev, botResponse]);
                        }
                      })
                      .catch(error => {
                        // Hide typing indicator on error
                        setIsTyping(false);
                        console.error("Error:", error);
                      });
                    }, 300);
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode
                      ? "#333333"
                      : "#f0f0f0";
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = darkMode
                      ? "0 4px 8px rgba(0, 0, 0, 0.4)"
                      : "0 4px 8px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode
                      ? "#2a2a2a"
                      : "white";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = darkMode
                      ? "0 2px 5px rgba(0, 0, 0, 0.3)"
                      : "0 2px 5px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <span>{ctaText}</span>
                  <span>{ctaIcon}</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  overflowY: "auto",
                  height: "100%",
                  paddingRight: "10px", // Add padding for scrollbar separation
                  scrollbarWidth: "thin",
                  scrollbarColor: `${
                    showScrollbar ? primaryColor : "transparent"
                  } transparent`,
                  transition: "scrollbar-color 0.3s ease",
                  msOverflowStyle: "none", // IE and Edge
                }}
                onScroll={handleScroll}
                className="custom-scrollbar"
              >
                <style>
                  {`
                    .custom-scrollbar::-webkit-scrollbar {
                      width: 8px;
                      background-color: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background-color: ${
                        showScrollbar
                          ? "rgba(138, 79, 255, 0.3)"
                          : "transparent"
                      };
                      border-radius: 4px;
                      transition: background-color 0.3s ease;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                      background-color: transparent;
                    }
                  `}
                </style>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px 15px",
                      borderRadius: "8px",
                      maxWidth: "80%",
                      marginLeft: msg.isUser ? "auto" : "0",
                      marginRight: msg.isUser ? "0" : "auto",
                      backgroundColor: msg.isUser
                        ? primaryColor
                        : darkMode
                        ? "#2a2a2a"
                        : "#ffffff",
                      color: msg.isUser
                        ? "#ffffff"
                        : darkMode
                        ? "#ffffff"
                        : "#000000",
                    }}
                  >
                    {msg.isUser ? (
                      msg.text
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ ...props}) => <p style={{margin: '0.5em 0'}} {...props} />,
                          a: ({ ...props}) => <a target="_blank" style={{color: primaryColor, textDecoration: 'underline'}} {...props} />,
                          ul: ({ ...props}) => <ul style={{paddingLeft: '20px', margin: '0.5em 0'}} {...props} />,
                          ol: ({ ...props}) => <ol style={{paddingLeft: '20px', margin: '0.5em 0'}} {...props} />,
                          li: ({ ...props}) => <li style={{margin: '0.25em 0'}} {...props} />,
                          h1: ({ ...props}) => <h1 style={{fontSize: '1.5em', margin: '0.5em 0'}} {...props} />,
                          h2: ({ ...props}) => <h2 style={{fontSize: '1.3em', margin: '0.5em 0'}} {...props} />,
                          h3: ({ ...props}) => <h3 style={{fontSize: '1.1em', margin: '0.5em 0'}} {...props} />,
                          code: ({inline, ...props}: React.HTMLAttributes<HTMLElement> & {inline?: boolean}) =>
                            inline 
                              ? <code style={{backgroundColor: darkMode ? '#333' : '#f0f0f0', padding: '0.2em 0.4em', borderRadius: '3px'}} {...props} />
                              : <code style={{display: 'block', backgroundColor: darkMode ? '#333' : '#f0f0f0', padding: '0.5em', borderRadius: '5px', overflowX: 'auto'}} {...props} />,
                          pre: ({ ...props}) => <pre style={{margin: '0.5em 0', width: '100%', overflowX: 'auto'}} {...props} />,
                          blockquote: ({ ...props}) => <blockquote style={{borderLeft: `3px solid ${primaryColor}`, paddingLeft: '10px', margin: '0.5em 0', color: darkMode ? '#ccc' : '#666'}} {...props} />,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div
                    style={{
                      padding: "10px 15px",
                      borderRadius: "8px",
                      maxWidth: "80%",
                      marginLeft: "0",
                      marginRight: "auto",
                      backgroundColor: darkMode ? "#2a2a2a" : "#ffffff",
                      color: darkMode ? "#ffffff" : "#000000",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div className="typing-animation">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}

                <style>
                  {`
                    .typing-animation {
                      display: flex;
                      align-items: center;
                      column-gap: 6px;
                    }
                    
                    .typing-animation span {
                      height: 8px;
                      width: 8px;
                      background-color: ${darkMode ? "#999999" : "#555555"};
                      border-radius: 50%;
                      display: block;
                      opacity: 0.4;
                    }
                    
                    .typing-animation span:nth-child(1) {
                      animation: pulse 1s infinite ease-in-out;
                    }
                    
                    .typing-animation span:nth-child(2) {
                      animation: pulse 1s infinite ease-in-out 0.2s;
                    }
                    
                    .typing-animation span:nth-child(3) {
                      animation: pulse 1s infinite ease-in-out 0.4s;
                    }
                    
                    @keyframes pulse {
                      0%, 100% {
                        transform: scale(1);
                        opacity: 0.4;
                      }
                      50% {
                        transform: scale(1.2);
                        opacity: 1;
                      }
                    }
                  `}
                </style>

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Added flex-grow to push the bottom elements down */}
            <div style={{ flexGrow: 1 }}></div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "auto",
              }}
            >
              {/* Eliminando el botón CTA duplicado */}

              <div style={styles.chatInput}>
                <textarea
                  style={styles.inputField}
                  placeholder={localizedInputPlaceholder}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  rows={1}
                  className="custom-scrollbar"
                />
                <button
                  style={styles.sendButton}
                  onClick={sendMessage}
                  onMouseDown={(e) => {
                    Object.assign(
                      e.currentTarget.style,
                      styles.sendButtonActive
                    );
                  }}
                  onMouseUp={(e) => {
                    Object.assign(
                      e.currentTarget.style,
                      styles.sendButtonHover
                    );
                  }}
                  onMouseOver={(e) => {
                    Object.assign(
                      e.currentTarget.style,
                      styles.sendButtonHover
                    );
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = darkMode
                      ? "#666666"
                      : "#888888";
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <PaperPlaneIcon />
                </button>
              </div>
              <div style={styles.poweredBy}>
               <LightningBoltIcon/> {localizedPoweredByText} <a href="https://pycat.dev/">{brandName}</a>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        style={styles.chatButton}
        onClick={toggleChat}
        onMouseOver={(e) => {
          Object.assign(e.currentTarget.style, styles.chatButtonHover);
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = styles.chatButton.boxShadow;
        }}
      >
        <span>{buttonIcon}</span>
      </button>
    </div>
  );
};

export default Chatbot;
