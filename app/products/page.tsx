"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X, Package } from "lucide-react";
import { formatCurrency, formatPercentage, convertToHalfWidth } from "@/lib/utils";
import { Navigation } from "@/components/navigation";
import { useProducts } from "../contexts/ProductsContext";

export default function ProductsPage() {
  const { products, updateProduct, addProduct, removeProduct } = useProducts();

  const calculateProduct = (price: number, variableCost: number) => {
    const marginalProfit = price - variableCost;
    const marginalProfitRate = price > 0 ? (marginalProfit / price) * 100 : 0;
    return { marginalProfit, marginalProfitRate };
  };

  const handleInputChange = (
    index: number,
    field: "name" | "price" | "variableCost",
    value: string | number
  ) => {
    const updatedProduct = {
      ...products[index],
      [field]: value,
    };
    updateProduct(index, updatedProduct);
  };

  const getRateColor = (rate: number) => {
    if (rate >= 50) return "text-green-600";
    if (rate >= 30) return "text-blue-600";
    if (rate >= 10) return "text-yellow-600";
    if (rate >= 0) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-3">
            <Package className="w-10 h-10 text-primary" />
            商品別分析
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            商品ごとの限界利益率を確認
          </p>
        </div>

        <Navigation />

        <div className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>商品リスト</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {products.map((product, index) => {
                const { marginalProfit, marginalProfitRate } = calculateProduct(
                  product.price,
                  product.variableCost
                );

                return (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                      <div className="lg:col-span-2">
                        <Label htmlFor={`name-${index}`}>商品名</Label>
                        <Input
                          id={`name-${index}`}
                          data-testid={`input-product-name-${index}`}
                          placeholder="商品名"
                          value={product.name}
                          onChange={(e) =>
                            handleInputChange(index, "name", e.target.value)
                          }
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <Label htmlFor={`price-${index}`}>販売価格</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            ¥
                          </span>
                          <Input
                            id={`price-${index}`}
                            data-testid={`input-product-price-${index}`}
                            type="number"
                            placeholder="0"
                            className="pl-8 font-mono"
                            value={product.price || ""}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "price",
                                parseFloat(convertToHalfWidth(e.target.value)) || 0
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        <Label htmlFor={`variableCost-${index}`}>変動費</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            ¥
                          </span>
                          <Input
                            id={`variableCost-${index}`}
                            data-testid={`input-product-variable-cost-${index}`}
                            type="number"
                            placeholder="0"
                            className="pl-8 font-mono"
                            value={product.variableCost || ""}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "variableCost",
                                parseFloat(convertToHalfWidth(e.target.value)) || 0
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        <Label>限界利益額</Label>
                        <div
                          className="text-lg font-bold font-mono"
                          data-testid={`result-product-marginal-profit-${index}`}
                        >
                          {formatCurrency(marginalProfit)}
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        <Label>限界利益率</Label>
                        <div
                          className={`text-lg font-bold font-mono ${getRateColor(
                            marginalProfitRate
                          )}`}
                          data-testid={`result-product-marginal-profit-rate-${index}`}
                        >
                          {formatPercentage(marginalProfitRate)}
                        </div>
                      </div>

                      <div className="lg:col-span-1 flex justify-center items-center">
                        <Button
                          onClick={() => removeProduct(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          data-testid={`button-remove-product-${index}`}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* フローティング追加ボタン */}
      <Button
        onClick={addProduct}
        size="lg"
        className="fixed bottom-8 right-8 rounded-full shadow-2xl h-16 w-16 p-0 hover:scale-110 transition-transform"
        data-testid="button-add-product-floating"
      >
        <Plus className="w-8 h-8" />
      </Button>
    </div>
  );
}
