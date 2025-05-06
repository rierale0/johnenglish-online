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
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};