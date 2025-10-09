"use client";

import { CalculationProvider } from "@/app/contexts/CalculationContext";
import { ProductsProvider } from "@/app/contexts/ProductsContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CalculationProvider>
      <ProductsProvider>{children}</ProductsProvider>
    </CalculationProvider>
  );
}
