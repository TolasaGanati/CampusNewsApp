import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");

        if (storedToken) {
          const userData = JSON.parse(storedToken);
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  const login = (userData) => {
    setUserData(userData);
    AsyncStorage.setItem("userToken", JSON.stringify(userData));
  };

  const logout = () => {
    setUserData(null);
    AsyncStorage.removeItem("userToken");
  };

  const clearUserData = async () => {
    try {
      setUserData(null);
      await AsyncStorage.removeItem("userToken");
    } catch (error) {
      console.error("Error clearing user data:", error.message);
    }
  };

  const authContextValue = {
    userData,
    login,
    logout,
    clearUserData, // Include the clearUserData function
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
