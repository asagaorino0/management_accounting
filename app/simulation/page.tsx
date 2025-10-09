"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TrendingUp, DollarSign, Calculator } from "lucide-react";
import { formatCurrency, formatPercentage, convertToHalfWidth } from "@/lib/utils";
import { Navigation } from "@/components/navigation";
import { useProducts } from "../contexts/ProductsContext";
import { useCalculation } from "../contexts/CalculationContext";

interface SimulationRow {
  price: number;
  variableCost: number;
  quantity: number;
  salesAmount: number;
  variableCostAmount: number;
}

export default function SimulationPage() {
  const { products } = useProducts();
  const { calculationData, updateCalculationData } = useCalculation();
  const [simulations, setSimulations] = useState<SimulationRow[]>([]);
  const fixedCost = calculationData.fixedCost;

  useEffect(() => {
    setSimulations(
      products.map((product) => ({
        price: product.price,
        variableCost: product.variableCost,
        quantity: 0,
        salesAmount: 0,
        variableCostAmount: 0,
      }))
    );
  }, [products]);

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

  const totalSales = simulations.reduce((sum, sim) => sum + sim.salesAmount, 0);
  const totalVariableCost = simulations.reduce(
    (sum, sim) => sum + sim.variableCostAmount,
    0
  );
  const marginalProfit = totalSales - totalVariableCost;
  const marginalProfitRate = totalSales > 0 ? (marginalProfit / totalSales) * 100 : 0;
  const operatingProfit = marginalProfit - fixedCost;
  const operatingProfitRate = totalSales > 0 ? (operatingProfit / totalSales) * 100 : 0;

  const breakEvenSales =
    marginalProfitRate > 0 ? (fixedCost / marginalProfitRate) * 100 : 0;
  const breakEvenRatio =
    totalSales > 0 ? (breakEvenSales / totalSales) * 100 : 0;

  const getBreakEvenStatus = (ratio: number) => {
    if (ratio < 60) return { label: "安泰", color: "bg-blue-500" };
    if (ratio < 70) return { label: "健全", color: "bg-green-500" };
    if (ratio < 80) return { label: "普通", color: "bg-yellow-500" };
    if (ratio < 90) return { label: "要注意", color: "bg-orange-500" };
    return { label: "危険", color: "bg-red-500" };
  };

  const breakEvenStatus = getBreakEvenStatus(breakEvenRatio);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              シミュレーター
            </h1>
            <p className="text-muted-foreground">
              商品の販売価格、変動費、販売数を変更して経営指標をシミュレーション
            </p>
          </div>

          {/* 全体計算結果 */}
          <div className="grid gap-3 md:grid-cols-3">
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  売上額
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xl font-bold" data-testid="result-total-sales">
                  {formatCurrency(totalSales)}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  変動費
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xl font-bold" data-testid="result-total-variable-cost">
                  {formatCurrency(totalVariableCost)}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calculator className="w-3 h-3" />
                  固定費
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <Input
                  type="number"
                  value={fixedCost || ""}
                  onChange={(e) => updateCalculationData({ fixedCost: Number(convertToHalfWidth(e.target.value)) || 0 })}
                  placeholder="0"
                  className="text-lg font-bold h-9"
                  data-testid="input-fixed-cost"
                />
              </CardContent>
            </Card>
          </div>

          {/* 計算結果 */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">限界利益額</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xl font-bold" data-testid="result-marginal-profit">
                  {formatCurrency(marginalProfit)}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">限界利益率</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xl font-bold" data-testid="result-marginal-profit-rate">
                  {formatPercentage(marginalProfitRate)}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">営業利益</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xl font-bold" data-testid="result-operating-profit">
                  {formatCurrency(operatingProfit)}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">営業利益率</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xl font-bold" data-testid="result-operating-profit-rate">
                  {formatPercentage(operatingProfitRate)}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">損益分岐点売上高</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xl font-bold" data-testid="result-break-even-sales">
                  {marginalProfitRate > 0
                    ? formatCurrency(breakEvenSales)
                    : "計算不可"}
                </div>
              </CardContent>
            </Card>

            <Card className={`shadow-lg ${breakEvenStatus.color} text-white`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">損益分岐点比率</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xl font-bold" data-testid="result-break-even-ratio">
                  {marginalProfitRate > 0 && totalSales > 0
                    ? formatPercentage(breakEvenRatio)
                    : "計算不可"}
                </div>
                {marginalProfitRate > 0 && totalSales > 0 && (
                  <div className="mt-1 text-xs font-semibold">
                    {breakEvenStatus.label}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 商品別シミュレーション */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>商品別販売シミュレーション</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 || (products.length === 1 && !products[0].name) ? (
                <div className="text-center py-8 text-muted-foreground">
                  「商品別分析」タブで商品を登録してください
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-6 gap-4 font-semibold text-sm text-muted-foreground pb-2 border-b">
                    <div>商品名</div>
                    <div className="text-right">販売価格</div>
                    <div className="text-right">変動費</div>
                    <div className="text-right">限界利益率</div>
                    <div className="text-right">販売数</div>
                    <div className="text-right">販売額</div>
                  </div>
                  {products.map((product, index) => {
                    if (!product.name) return null;
                    const sim = simulations[index];
                    if (!sim) return null;

                    const marginalProfit = sim.price - sim.variableCost;
                    const marginalProfitRate = sim.price > 0 ? (marginalProfit / sim.price) * 100 : 0;

                    // 元の限界利益率を計算
                    const originalMarginalProfit = product.price - product.variableCost;
                    const originalMarginalProfitRate = product.price > 0 ? (originalMarginalProfit / product.price) * 100 : 0;

                    // 増減率を計算（パーセントポイント）
                    const rateDifference = marginalProfitRate - originalMarginalProfitRate;
                    const rateChangeColor = rateDifference > 0 ? "text-green-600" : rateDifference < 0 ? "text-red-600" : "text-gray-500";
                    const rateChangeSymbol = rateDifference > 0 ? "+" : "";

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-6 gap-4 items-center"
                        data-testid={`simulation-row-${index}`}
                      >
                        <div className="font-medium">{product.name}</div>
                        <div>
                          <Input
                            type="number"
                            value={sim.price || ""}
                            onChange={(e) =>
                              updateSimulation(index, "price", Number(convertToHalfWidth(e.target.value)) || 0)
                            }
                            placeholder="0"
                            className="text-right font-mono"
                            data-testid={`input-sim-price-${index}`}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            value={sim.variableCost || ""}
                            onChange={(e) =>
                              updateSimulation(index, "variableCost", Number(convertToHalfWidth(e.target.value)) || 0)
                            }
                            placeholder="0"
                            className="text-right font-mono"
                            data-testid={`input-sim-variable-cost-${index}`}
                          />
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm font-bold">
                            {formatPercentage(marginalProfitRate)}
                          </div>
                          <div className={`text-xs ${rateChangeColor}`} data-testid={`rate-change-${index}`}>
                            {rateChangeSymbol}{formatPercentage(rateDifference)}
                          </div>
                        </div>
                        <div>
                          <Input
                            type="number"
                            value={sim.quantity || ""}
                            onChange={(e) =>
                              updateSimulation(index, "quantity", Number(convertToHalfWidth(e.target.value)) || 0)
                            }
                            placeholder="0"
                            className="text-right"
                            data-testid={`input-quantity-${index}`}
                          />
                        </div>
                        <div
                          className="text-right font-mono font-bold"
                          data-testid={`result-sales-amount-${index}`}
                        >
                          {formatCurrency(sim.salesAmount || 0)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
