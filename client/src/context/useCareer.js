import { useContext } from "react";
import { CareerContext } from "./CareerContextObject";

export function useCareer() {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error("useCareer must be used within a CareerProvider");
  }
  return context;
}

