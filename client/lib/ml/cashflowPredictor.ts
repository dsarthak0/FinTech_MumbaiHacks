// Mock ML predictions for 30-day cashflow forecast

import { ForecastData, Transaction } from "@/types";
import { getDateRange } from "../utils/format";

export function generateCashflowForecast(
  transactions: Transaction[],
  days = 30
): ForecastData[] {
  const { start, end } = getDateRange(days);

  // Calculate historical averages
  const historicalTransactions = transactions.filter(
    (t) => t.timestamp >= start.getTime() && t.timestamp <= end.getTime()
  );

  const totalIncome = historicalTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = historicalTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const daysInRange = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const avgDailyIncome = totalIncome / daysInRange;
  const avgDailyExpense = totalExpenses / daysInRange;

  // Generate 30-day forecast with variance
  const forecast: ForecastData[] = [];
  let runningBalance = totalIncome - totalExpenses;

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    // Add variance to make it realistic (50-150% of average)
    const variance = 0.5 + Math.random();
    const predictedInflow = Math.round(avgDailyIncome * variance);
    const predictedOutflow = Math.round(avgDailyExpense * variance * 0.8);

    runningBalance += predictedInflow - predictedOutflow;

    forecast.push({
      date: date.toISOString().split("T")[0],
      predictedInflow,
      predictedOutflow,
      safeToSpend: Math.max(0, runningBalance - 5000), // Keep 5000 as buffer
      balance: runningBalance,
    });
  }

  return forecast;
}

export function calculateRiskLevel(
  forecast: ForecastData[]
): "safe" | "caution" | "danger" {
  const avgBalance =
    forecast.reduce((sum, f) => sum + f.balance, 0) / forecast.length;
  const minBalance = Math.min(...forecast.map((f) => f.balance));

  if (minBalance < 0) return "danger";
  if (minBalance < 5000 || avgBalance < 10000) return "caution";
  return "safe";
}

export function getDailyBudget(
  forecast: ForecastData[],
  transactionHistory: Transaction[]
): number {
  if (forecast.length === 0) return 0;

  const today = new Date();
  const todayForecast = forecast.find(
    (f) => f.date === today.toISOString().split("T")[0]
  );
  if (!todayForecast) return 0;

  return Math.max(0, todayForecast.safeToSpend);
}
