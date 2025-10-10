"use client";

import { useState, useEffect } from "react";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatPercentage, convertToHalfWidth } from "@/lib/utils";
import { Navigation } from "@/components/navigation";
import { useCalculation } from "./contexts/CalculationContext";

interface FormData {
  sales: number;
  variableCost: number;
  fixedCost: number;
  investment: number;
}

interface CalculationResults {
  marginalProfit: number;
  marginalProfitRate: number;
  breakEvenPoint: number;
  breakEvenPointRatio: number;
  operatingProfit: number;
  operatingProfitRate: number;
  roi: number;
}

export default function Home() {
  const { calculationData, updateCalculationData } = useCalculation();
  const formData = calculationData;

  const [calculations, setCalculations] = useState<CalculationResults>({
    marginalProfit: 0,
    marginalProfitRate: 0,
    breakEvenPoint: 0,
    breakEvenPointRatio: 0,
    operatingProfit: 0,
    operatingProfitRate: 0,
    roi: 0,
  });

  // 計算ロジック
  useEffect(() => {
    const { sales, variableCost, fixedCost, investment } = formData;

    // 限界利益
    const marginalProfit = sales - variableCost;

    // 限界利益率
    const marginalProfitRate = sales > 0 ? (marginalProfit / sales) * 100 : 0;

    // 損益分岐点売上高
    // 限界利益率が0以下の場合は計算不可（売れば売るほど赤字）
    const breakEvenPoint =
      marginalProfitRate > 0 ? fixedCost / (marginalProfitRate / 100) : Infinity;

    // 損益分岐点売上率
    // 損益分岐点が計算不可の場合は100%（危険状態）
    const breakEvenPointRatio =
      breakEvenPoint === Infinity ? 100 :
        sales > 0 ? (breakEvenPoint / sales) * 100 : 0;

    // 営業利益
    const operatingProfit = marginalProfit - fixedCost;

    // 営業利益率
    const operatingProfitRate = sales > 0 ? (operatingProfit / sales) * 100 : 0;

    // ROI
    const roi = investment > 0 ? (operatingProfit / investment) * 100 : 0;

    setCalculations({
      marginalProfit,
      marginalProfitRate,
      breakEvenPoint,
      breakEvenPointRatio,
      operatingProfit,
      operatingProfitRate,
      roi,
    });
  }, [formData]);

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const convertedValue = convertToHalfWidth(e.target.value);
      const value = parseFloat(convertedValue) || 0;
      updateCalculationData({ [field]: value });
    };

  const getProfitColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getBreakEvenRatioStatus = (ratio: number) => {
    if (ratio < 60) {
      return { label: "安泰", color: "text-green-600 bg-green-50", badgeColor: "bg-green-600" };
    } else if (ratio < 70) {
      return { label: "健全", color: "text-blue-600 bg-blue-50", badgeColor: "bg-blue-600" };
    } else if (ratio < 80) {
      return { label: "普通", color: "text-yellow-600 bg-yellow-50", badgeColor: "bg-yellow-600" };
    } else if (ratio < 90) {
      return { label: "要注意", color: "text-orange-600 bg-orange-50", badgeColor: "bg-orange-600" };
    } else {
      return { label: "危険", color: "text-red-600 bg-red-50", badgeColor: "bg-red-600" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-3">
            <Calculator className="w-10 h-10 text-primary" />
            管理会計計算機
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            限界利益・損益分岐点を計算
          </p>
        </div>

        <Navigation />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>入力値</span>
                {/* <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                    data-testid="button-history"
                  >
                    <History className="w-4 h-4 mr-2" />
                    履歴
                  </Button>
                </div> */}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="sales">売上額</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ¥
                  </span>
                  <Input
                    type="number"
                    id="sales"
                    data-testid="input-sales"
                    placeholder="0"
                    className="pl-10 font-mono"
                    value={formData.sales || ""}
                    onChange={handleInputChange("sales")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="variableCost">変動費</Label>
                <p className="text-xs text-muted-foreground">
                  売れれば売れるほどかかる費用（材料費、外注費、仕入れ高、送料など）
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ¥
                  </span>
                  <Input
                    type="number"
                    id="variableCost"
                    data-testid="input-variable-cost"
                    placeholder="0"
                    className="pl-10 font-mono"
                    value={formData.variableCost || ""}
                    onChange={handleInputChange("variableCost")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fixedCost">固定費</Label>
                <p className="text-xs text-muted-foreground">
                  売れても売れなくてもかかる費用（人件費、地代家賃、光熱水料、広告費、交際費、会議費など）
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ¥
                  </span>
                  <Input
                    type="number"
                    id="fixedCost"
                    data-testid="input-fixed-cost"
                    placeholder="0"
                    className="pl-10 font-mono"
                    value={formData.fixedCost || ""}
                    onChange={handleInputChange("fixedCost")}
                  />
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="investment">
                  投資額 <span className="text-xs text-muted-foreground">(ROI計算用)</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ¥
                  </span>
                  <Input
                    type="number"
                    id="investment"
                    data-testid="input-investment"
                    placeholder="0"
                    className="pl-10 font-mono"
                    value={formData.investment || ""}
                    onChange={handleInputChange("investment")}
                  />
                </div>
              </div> */}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="result-card shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">限界利益額</h3>
                    <p className="text-xs text-muted-foreground">
                      Marginal Profit
                    </p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div
                  className="text-3xl font-bold font-mono"
                  data-testid="result-marginal-profit"
                >
                  {formatCurrency(calculations.marginalProfit)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  売上額 − 変動費
                </div>
              </CardContent>
            </Card>

            <Card className="result-card shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">限界利益率</h3>
                    <p className="text-xs text-muted-foreground">
                      Marginal Profit Rate
                    </p>
                  </div>
                </div>
                <div
                  className="text-3xl font-bold font-mono"
                  data-testid="result-marginal-profit-rate"
                >
                  {formatPercentage(calculations.marginalProfitRate)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  (限界利益額 ÷ 売上額) × 100
                </div>
              </CardContent>
            </Card>
            <Card className="result-card shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">営業利益</h3>
                    <p className="text-xs text-muted-foreground">
                      Operating Profit
                    </p>
                  </div>
                </div>
                <div
                  className={`text-3xl font-bold font-mono ${getProfitColor(calculations.operatingProfit)}`}
                  data-testid="result-operating-profit"
                >
                  {formatCurrency(calculations.operatingProfit)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  限界利益額 − 固定費
                </div>
              </CardContent>
            </Card>

            <Card className="result-card shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">損益分岐点売上高</h3>
                    <p className="text-xs text-muted-foreground">
                      Break-Even Point
                    </p>
                    <p className="text-xs text-muted-foreground">
                      これ以上あれば、利益が出るボーダーライン
                    </p>
                  </div>
                  <DollarSign className="w-6 h-6 text-secondary" />
                </div>
                <div
                  className="text-3xl font-bold font-mono"
                  data-testid="result-break-even-point"
                >
                  {formatCurrency(calculations.breakEvenPoint)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  固定費 ÷ (限界利益率 ÷ 100)
                </div>
              </CardContent>
            </Card>

            <Card className={`result-card shadow-lg ${getBreakEvenRatioStatus(calculations.breakEvenPointRatio).color}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">損益分岐点売上率</h3>
                    <p className="text-xs text-muted-foreground">
                      Break-Even Point Ratio
                    </p>
                    <p className="text-xs text-muted-foreground">
                      低ければ低いほど安全
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getBreakEvenRatioStatus(calculations.breakEvenPointRatio).badgeColor}`}>
                    {getBreakEvenRatioStatus(calculations.breakEvenPointRatio).label}
                  </div>
                </div>
                <div
                  className="text-3xl font-bold font-mono mb-3"
                  data-testid="result-break-even-point-ratio"
                >
                  {formatPercentage(calculations.breakEvenPointRatio)}
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  (損益分岐点売上高 ÷ 売上額) × 100
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <span>60%未満: 安泰</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span>60〜70%未満: 健全</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                    <span>70〜80%未満: 普通</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                    <span>80〜90%未満: 要注意</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span>90〜100%: 危険</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <div className="grid grid-cols-2 gap-4">
              <Card className="result-card shadow-lg">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-1">営業利益率</h3>
                  <div
                    className="text-2xl font-bold font-mono"
                    data-testid="result-operating-profit-rate"
                  >
                    {formatPercentage(calculations.operatingProfitRate)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    (営業利益 ÷ 売上額) × 100
                  </div>
                </CardContent>
              </Card>

              <Card className="result-card shadow-lg">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-1">ROI</h3>
                  <div
                    className="text-2xl font-bold font-mono"
                    data-testid="result-roi"
                  >
                    {formatPercentage(calculations.roi)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    (営業利益 ÷ 投資額) × 100
                  </div>
                </CardContent>
              </Card>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
