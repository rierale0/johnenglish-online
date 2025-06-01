"use client"; // This directive is necessary for using Context API and hooks in Next.js App Router
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config'; // Adjust the import path if necessary

// Define the shape of the context data
interface AuthContextType {
  user: User | null;
  loading: boolean;
  // We will add login, logout, signup functions later
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Create the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  const value = {
    user,
    loading,
  };

  // Provide the authentication context to children components
  // Show loading indicator or children based on the loading state
  return (
    <AuthContext.Provider value={value}>
  {loading ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#222222]">
      <svg className="animate-spin h-12 w-12 mb-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <p className="text-white text-lg">Cargando...</p>
    </div>
  ) : (
    children
  )}
</AuthContext.Provider>

  );
};

// Create a custom hook to use the auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};