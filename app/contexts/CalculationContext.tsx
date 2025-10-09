"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CalculationData {
  sales: number;
  variableCost: number;
  fixedCost: number;
  investment: number;
}

interface CalculationContextType {
  calculationData: CalculationData;
  updateCalculationData: (data: Partial<CalculationData>) => void;
}

const CalculationContext = createContext<CalculationContextType | undefined>(
  undefined
);

export function CalculationProvider({ children }: { children: ReactNode }) {
  const [calculationData, setCalculationData] = useState<CalculationData>({
    sales: 0,
    variableCost: 0,
    fixedCost: 0,
    investment: 0,
  });

  const updateCalculationData = (data: Partial<CalculationData>) => {
    setCalculationData((prev) => ({ ...prev, ...data }));
  };

  return (
    <CalculationContext.Provider
      value={{ calculationData, updateCalculationData }}
    >
      {children}
    </CalculationContext.Provider>
  );
}

export function useCalculation() {
  const context = useContext(CalculationContext);
  if (context === undefined) {
    throw new Error("useCalculation must be used within a CalculationProvider");
  }
  return context;
}
