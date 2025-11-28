// Mock analysis of income variability for gig workers

import { Transaction } from "@/types";

export interface IncomeVariability {
  avgMonthlyIncome: number;
  minMonthlyIncome: number;
  maxMonthlyIncome: number;
  variance: number;
  trend: "increasing" | "decreasing" | "stable";
  nextExpectedIncome: number;
  daysUntilNextIncome: number;
}

export function analyzeIncomeVariability(
  transactions: Transaction[]
): IncomeVariability {
  const incomeTransactions = transactions.filter((t) => t.type === "income");

  if (incomeTransactions.length === 0) {
    return {
      avgMonthlyIncome: 0,
      minMonthlyIncome: 0,
      maxMonthlyIncome: 0,
      variance: 0,
      trend: "stable",
      nextExpectedIncome: 0,
      daysUntilNextIncome: 0,
    };
  }

  // Group by month
  const monthlyIncomes: { [key: string]: number } = {};
  incomeTransactions.forEach((t) => {
    const date = new Date(t.timestamp);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    monthlyIncomes[key] = (monthlyIncomes[key] || 0) + t.amount;
  });

  const incomes = Object.values(monthlyIncomes);
  const avgMonthlyIncome = incomes.reduce((a, b) => a + b, 0) / incomes.length;
  const minMonthlyIncome = Math.min(...incomes);
  const maxMonthlyIncome = Math.max(...incomes);

  // Calculate variance
  const squaredDiffs = incomes.map((income) =>
    Math.pow(income - avgMonthlyIncome, 2)
  );
  const variance = Math.sqrt(
    squaredDiffs.reduce((a, b) => a + b, 0) / incomes.length
  );

  // Determine trend
  const recentIncomes = incomes.slice(-3);
  const recentAvg =
    recentIncomes.reduce((a, b) => a + b, 0) / recentIncomes.length;
  const olderAvg =
    incomes.slice(0, -3).reduce((a, b) => a + b, 0) /
    Math.max(1, incomes.length - 3);
  let trend: "increasing" | "decreasing" | "stable" = "stable";
  if (recentAvg > olderAvg * 1.1) trend = "increasing";
  if (recentAvg < olderAvg * 0.9) trend = "decreasing";

  // Calculate next expected income based on frequency
  const daysSinceLastIncome =
    (Date.now() - incomeTransactions[0].timestamp) / (1000 * 60 * 60 * 24);
  const avgDaysBetweenIncome = daysSinceLastIncome / incomeTransactions.length;

  return {
    avgMonthlyIncome,
    minMonthlyIncome,
    maxMonthlyIncome,
    variance,
    trend,
    nextExpectedIncome: avgMonthlyIncome / 30,
    daysUntilNextIncome: Math.max(1, Math.ceil(avgDaysBetweenIncome)),
  };
}
