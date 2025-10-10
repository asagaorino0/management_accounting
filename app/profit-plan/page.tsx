"use client";

import { Target, TrendingUp, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, convertToHalfWidth } from "@/lib/utils";
import { Navigation } from "@/components/navigation";
import { useCalculation, type ProfitPlanData } from "../contexts/CalculationContext";

export default function ProfitPlanPage() {
  const { profitPlanData, updateProfitPlanData } = useCalculation();
  const planData = profitPlanData;

  const handleInputChange =
    (field: keyof ProfitPlanData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const convertedValue = convertToHalfWidth(e.target.value);
      const value = parseFloat(convertedValue) || 0;
      updateProfitPlanData({ [field]: value });
    };

  // 利益達成に必要な月間売上額：（欲しい利益額＋固定費）÷限界利益率（平均）
  const requiredMonthlySales = planData.targetMarginalProfitRate > 0
    ? (planData.desiredProfit + planData.fixedCostForecast) / (planData.targetMarginalProfitRate / 100)
    : 0;

  // 今日までの利益目標の達成度：（今日までの売り上げ合計×限界利益率（平均））÷（固定費＋欲しい利益額（月間））
  const achievementStatus = (planData.fixedCostForecast + planData.desiredProfit) > 0
    ? (planData.currentSales * (planData.targetMarginalProfitRate / 100)) / (planData.fixedCostForecast + planData.desiredProfit)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-3">
            <Target className="w-10 h-10 text-primary" />
            利益計画
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            どれくらい売上を達成すれば利益が出るか
          </p>
        </div>

        <Navigation />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 入力セクション */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>目標設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="desiredProfit">欲しい営業利益（月間）</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ¥
                  </span>
                  <Input
                    type="number"
                    id="desiredProfit"
                    data-testid="input-desired-profit"
                    placeholder="0"
                    className="pl-10 font-mono"
                    value={planData.desiredProfit || ""}
                    onChange={handleInputChange("desiredProfit")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fixedCostForecast">固定費（予測額・月間）</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ¥
                  </span>
                  <Input
                    type="number"
                    id="fixedCostForecast"
                    data-testid="input-fixed-cost-forecast"
                    placeholder="0"
                    className="pl-10 font-mono"
                    value={planData.fixedCostForecast || ""}
                    onChange={handleInputChange("fixedCostForecast")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetMarginalProfitRate">目指す限界利益率（平均）</Label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                  <Input
                    type="number"
                    id="targetMarginalProfitRate"
                    data-testid="input-target-marginal-profit-rate"
                    placeholder="0"
                    className="pr-10 font-mono"
                    value={planData.targetMarginalProfitRate || ""}
                    onChange={handleInputChange("targetMarginalProfitRate")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSales">今日までの売上合計</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ¥
                  </span>
                  <Input
                    type="number"
                    id="currentSales"
                    data-testid="input-current-sales"
                    placeholder="0"
                    className="pl-10 font-mono"
                    value={planData.currentSales || ""}
                    onChange={handleInputChange("currentSales")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 計算結果セクション */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>計算結果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    利益達成に必要な月間売上額
                  </h3>
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400" data-testid="result-required-monthly-sales">
                  {isFinite(requiredMonthlySales) ? formatCurrency(requiredMonthlySales) : '計算不可'}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  （欲しい利益額 + 固定費）÷ 限界利益率
                </p>
              </div>

              <div className="p-6 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    今日までの利益目標の達成度
                  </h3>
                </div>
                <div
                  className={`text-3xl font-bold ${achievementStatus >= 1
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                    }`}
                  data-testid="result-achievement-status"
                >
                  {isFinite(achievementStatus) ? `${(achievementStatus * 100).toFixed(1)}%` : '計算不可'}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  （今日までの売上 × 限界利益率）÷ （固定費 + 欲しい利益額）
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
