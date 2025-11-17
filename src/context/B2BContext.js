import React, { createContext, useContext, useEffect, useState } from "react";

const B2BContext = createContext(null);

export function B2BProvider({ children }) {
  const [b2bMode, setB2bMode] = useState(() => {
    try {
      const raw = window.localStorage.getItem("b2b_mode");
      return raw === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("b2b_mode", b2bMode ? "1" : "0");
    } catch {
      // ignore storage issues in demo
    }
  }, [b2bMode]);

  const toggleB2BMode = () => setB2bMode((prev) => !prev);

  return (
    <B2BContext.Provider value={{ b2bMode, setB2bMode, toggleB2BMode }}>
      {children}
    </B2BContext.Provider>
  );
}

export function useB2B() {
  const ctx = useContext(B2BContext);
  if (!ctx) {
    throw new Error("useB2B must be used within a B2BProvider");
  }
  return ctx;
}
