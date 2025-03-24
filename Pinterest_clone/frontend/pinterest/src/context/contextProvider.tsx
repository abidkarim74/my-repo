import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { User } from "../interfaces/userInterface.tsx";
import { getAuthenticatedUser } from "../api/apiRequests.tsx";

// Define the context value type
interface AuthContextValue {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextValue>({
  user: null,
  authenticated: false,
  loading: false,
  error: null,
});

// Define props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true); // Start loading
        const userInfo = await getAuthenticatedUser("authenticated/");
        console.log("API Response - authenticated:", userInfo.authenticated); // Log API response

        setUser(userInfo.user);
        setAuthenticated(userInfo.authenticated); // Schedule state update
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setUser(null);
        setAuthenticated(false);
        setError("Failed to authenticate. Please try again later.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchUser();
  }, []);



  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        loading,
        error,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
