import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = window.localStorage.getItem("demo_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const signIn = (name) => {
    const trimmed = (name || "").trim();
    const value = { name: trimmed || "Guest" };
    setUser(value);
    try {
      window.localStorage.setItem("demo_user", JSON.stringify(value));
    } catch {
      // ignore storage errors in demo
    }
  };

  const signOut = () => {
    setUser(null);
    try {
      window.localStorage.removeItem("demo_user");
    } catch {
      // ignore
    }
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}
