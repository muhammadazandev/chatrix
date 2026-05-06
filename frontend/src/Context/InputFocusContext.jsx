import { createContext, useContext, useRef } from "react";

const FocusContext = createContext(null);

export function FocusProvider({ children }) {
  const inputRef = useRef(null);

  return (
    <FocusContext.Provider value={inputRef}>{children}</FocusContext.Provider>
  );
}

export function useFocusInput() {
  return useContext(FocusContext);
}