"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CalculationData {
  sales: number;
  variableCost: number;
  fixedCost: number;
  investment: number;
}

export interface ProfitPlanData {
  desiredProfit: number;
  fixedCostForecast: number;
  targetMarginalProfitRate: number;
  currentSales: number;
}

interface CalculationContextType {
  calculationData: CalculationData;
  updateCalculationData: (data: Partial<CalculationData>) => void;
  profitPlanData: ProfitPlanData;
  updateProfitPlanData: (data: Partial<ProfitPlanData>) => void;
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

  const [profitPlanData, setProfitPlanData] = useState<ProfitPlanData>({
    desiredProfit: 0,
    fixedCostForecast: 0,
    targetMarginalProfitRate: 0,
    currentSales: 0,
  });

  const updateCalculationData = (data: Partial<CalculationData>) => {
    setCalculationData((prev) => ({ ...prev, ...data }));
  };

  const updateProfitPlanData = (data: Partial<ProfitPlanData>) => {
    setProfitPlanData((prev) => ({ ...prev, ...data }));
  };

  return (
    <CalculationContext.Provider
      value={{
        calculationData,
        updateCalculationData,
        profitPlanData,
        updateProfitPlanData
      }}
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
