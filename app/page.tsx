"use client";

import { useState, useEffect } from "react";
import { Calculator, TrendingUp, DollarSign, Save, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import type { Calculation } from "@/shared/schema";

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
  operatingProfit: number;
  operatingProfitRate: number;
  roi: number;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    sales: 0,
    variableCost: 0,
    fixedCost: 0,
    investment: 0,
  });

  const [calculations, setCalculations] = useState<CalculationResults>({
    marginalProfit: 0,
    marginalProfitRate: 0,
    breakEvenPoint: 0,
    operatingProfit: 0,
    operatingProfitRate: 0,
    roi: 0,
  });

  const [history, setHistory] = useState<Calculation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [calculationName, setCalculationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 計算ロジック
  useEffect(() => {
    const { sales, variableCost, fixedCost, investment } = formData;

    // 限界利益
    const marginalProfit = sales - variableCost;

    // 限界利益率
    const marginalProfitRate = sales > 0 ? (marginalProfit / sales) * 100 : 0;

    // 損益分岐点売上高
    const breakEvenPoint = marginalProfitRate > 0 ? fixedCost / (marginalProfitRate / 100) : 0;

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
      operatingProfit,
      operatingProfitRate,
      roi,
    });
  }, [formData]);

  // 履歴取得
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/calculations");
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!calculationName.trim()) {
      alert("計算名を入力してください");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: calculationName,
          ...formData,
          ...calculations,
        }),
      });

      if (response.ok) {
        setCalculationName("");
        await fetchHistory();
        alert("保存しました");
      }
    } catch (error) {
      console.error("Failed to save:", error);
      alert("保存に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = (calc: Calculation) => {
    setFormData({
      sales: calc.sales,
      variableCost: calc.variableCost,
      fixedCost: calc.fixedCost,
      investment: calc.investment || 0,
    });
    setShowHistory(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この計算を削除しますか？")) return;

    try {
      const response = await fetch(`/api/calculations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchHistory();
        alert("削除しました");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("削除に失敗しました");
    }
  };

  const getProfitColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
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
            限界利益・損益分岐点・ROIを計算
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>入力値</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                    data-testid="button-history"
                  >
                    <History className="w-4 h-4 mr-2" />
                    履歴
                  </Button>
                </div>
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

              <div className="space-y-2">
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
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="計算名を入力"
                    value={calculationName}
                    onChange={(e) => setCalculationName(e.target.value)}
                    data-testid="input-calculation-name"
                  />
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    data-testid="button-save"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="result-card shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">限界利益額</h3>
                    <p className="text-xs text-muted-foreground">Marginal Profit</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold font-mono" data-testid="result-marginal-profit">
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
                    <p className="text-xs text-muted-foreground">Marginal Profit Rate</p>
                  </div>
                </div>
                <div className="text-3xl font-bold font-mono" data-testid="result-marginal-profit-rate">
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
                    <h3 className="text-lg font-semibold">損益分岐点売上高</h3>
                    <p className="text-xs text-muted-foreground">Break-Even Point</p>
                  </div>
                  <DollarSign className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-3xl font-bold font-mono" data-testid="result-break-even-point">
                  {formatCurrency(calculations.breakEvenPoint)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  固定費 ÷ (限界利益率 ÷ 100)
                </div>
              </CardContent>
            </Card>

            <Card className="result-card shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">営業利益</h3>
                    <p className="text-xs text-muted-foreground">Operating Profit</p>
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

            <div className="grid grid-cols-2 gap-4">
              <Card className="result-card shadow-lg">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-1">営業利益率</h3>
                  <div className="text-2xl font-bold font-mono" data-testid="result-operating-profit-rate">
                    {formatPercentage(calculations.operatingProfitRate)}
                  </div>
                </CardContent>
              </Card>

              <Card className="result-card shadow-lg">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-1">ROI</h3>
                  <div className="text-2xl font-bold font-mono" data-testid="result-roi">
                    {formatPercentage(calculations.roi)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {showHistory && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>計算履歴</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  履歴がありません
                </p>
              ) : (
                <div className="space-y-2">
                  {history.map((calc) => (
                    <div
                      key={calc.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                    >
                      <div>
                        <h4 className="font-semibold">{calc.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          売上: {formatCurrency(calc.sales)} | 
                          限界利益: {formatCurrency(calc.marginalProfit)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoad(calc)}
                          data-testid={`button-load-${calc.id}`}
                        >
                          読込
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(calc.id)}
                          data-testid={`button-delete-${calc.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
