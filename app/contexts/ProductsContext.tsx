"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ProductData {
  name: string;
  price: number;
  variableCost: number;
}

interface ProductsContextType {
  products: ProductData[];
  setProducts: (products: ProductData[]) => void;
  updateProduct: (index: number, product: ProductData) => void;
  addProduct: () => void;
  removeProduct: (index: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ProductData[]>([
    { name: "", price: 0, variableCost: 0 },
  ]);

  const updateProduct = (index: number, product: ProductData) => {
    const newProducts = [...products];
    newProducts[index] = product;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", price: 0, variableCost: 0 }]);
  };

  const removeProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(
      newProducts.length > 0
        ? newProducts
        : [{ name: "", price: 0, variableCost: 0 }]
    );
  };

  return (
    <ProductsContext.Provider
      value={{ products, setProducts, updateProduct, addProduct, removeProduct }}
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
