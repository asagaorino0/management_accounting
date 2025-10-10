"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ProductData {
  name: string;
  price: number;
  variableCost: number;
}

export interface SimulationRow {
  price: number;
  variableCost: number;
  quantity: number;
  salesAmount: number;
  variableCostAmount: number;
}

interface ProductsContextType {
  products: ProductData[];
  setProducts: (products: ProductData[]) => void;
  updateProduct: (index: number, product: ProductData) => void;
  addProduct: () => void;
  removeProduct: (index: number) => void;
  simulations: SimulationRow[];
  updateSimulation: (index: number, field: "price" | "variableCost" | "quantity", value: number) => void;
  simulatorFixedCost: number;
  setSimulatorFixedCost: (cost: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProductsInternal] = useState<ProductData[]>([
    { name: "", price: 0, variableCost: 0 },
  ]);

  const [simulations, setSimulations] = useState<SimulationRow[]>([
    {
      price: 0,
      variableCost: 0,
      quantity: 0,
      salesAmount: 0,
      variableCostAmount: 0,
    },
  ]);

  const [simulatorFixedCost, setSimulatorFixedCost] = useState<number>(0);

  // Sync simulations with products, preserving quantities
  const setProducts = (newProducts: ProductData[]) => {
    setProductsInternal(newProducts);
    // Update simulations to match new products, preserving quantities
    const newSimulations = newProducts.map((product, index) => {
      const existingSim = simulations[index];
      const quantity = existingSim?.quantity || 0;
      return {
        price: product.price,
        variableCost: product.variableCost,
        quantity: quantity,
        salesAmount: product.price * quantity,
        variableCostAmount: product.variableCost * quantity,
      };
    });
    setSimulations(newSimulations);
  };

  const updateProduct = (index: number, product: ProductData) => {
    const newProducts = [...products];
    newProducts[index] = product;
    setProductsInternal(newProducts);

    // Update corresponding simulation with new base values
    const newSimulations = [...simulations];
    if (newSimulations[index]) {
      newSimulations[index] = {
        ...newSimulations[index],
        price: product.price,
        variableCost: product.variableCost,
        salesAmount: product.price * newSimulations[index].quantity,
        variableCostAmount: product.variableCost * newSimulations[index].quantity,
      };
      setSimulations(newSimulations);
    }
  };

  const addProduct = () => {
    const newProducts = [...products, { name: "", price: 0, variableCost: 0 }];
    const newSimulations = [
      ...simulations,
      {
        price: 0,
        variableCost: 0,
        quantity: 0,
        salesAmount: 0,
        variableCostAmount: 0,
      },
    ];
    setProductsInternal(newProducts);
    setSimulations(newSimulations);
  };

  const removeProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    const newSimulations = simulations.filter((_, i) => i !== index);
    const finalProducts = newProducts.length > 0
      ? newProducts
      : [{ name: "", price: 0, variableCost: 0 }];
    const finalSimulations = newSimulations.length > 0
      ? newSimulations
      : [{
        price: 0,
        variableCost: 0,
        quantity: 0,
        salesAmount: 0,
        variableCostAmount: 0,
      }];
    setProductsInternal(finalProducts);
    setSimulations(finalSimulations);
  };

  const updateSimulation = (
    index: number,
    field: "price" | "variableCost" | "quantity",
    value: number
  ) => {
    const newSimulations = [...simulations];
    const sim = { ...newSimulations[index], [field]: value };
    sim.salesAmount = sim.price * sim.quantity;
    sim.variableCostAmount = sim.variableCost * sim.quantity;
    newSimulations[index] = sim;
    setSimulations(newSimulations);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,
        updateProduct,
        addProduct,
        removeProduct,
        simulations,
        updateSimulation,
        simulatorFixedCost,
        setSimulatorFixedCost,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
