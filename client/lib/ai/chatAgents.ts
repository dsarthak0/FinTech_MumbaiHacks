// Mock AI chat agent for generating responses

import { ForecastData, Transaction } from "@/types";
import { formatCurrency, getDateRange } from "../utils/format";

export function generateChatResponse(
  userMessage: string,
  transactions: Transaction[],
  forecast: ForecastData[]
): string {
  const msg = userMessage.toLowerCase();

  // Calculate context
  const { start, end } = getDateRange(30);
  const monthTransactions = transactions.filter(
    (t) => t.timestamp >= start.getTime() && t.timestamp <= end.getTime()
  );

  const totalIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const safeToSpend = forecast[0]?.safeToSpend || 0;

  // Intent matching
  if (
    msg.includes("can i spend") ||
    msg.includes("should i buy") ||
    msg.includes("afford")
  ) {
    const amount = extractAmount(userMessage);
    if (amount) {
      if (amount <= safeToSpend) {
        return `Yes! You can safely spend ₹${amount} today. You have ₹${formatCurrency(
          safeToSpend
        )} available to spend. Just make sure it aligns with your needs.`;
      } else {
        return `I'd recommend being cautious with ₹${amount}. Your safe daily spend is ₹${formatCurrency(
          safeToSpend
        )}. Consider postponing this purchase or adjusting other spending.`;
      }
    }
  }

  if (
    msg.includes("forecast") ||
    msg.includes("why is my") ||
    msg.includes("low")
  ) {
    const avgBalance =
      forecast.reduce((sum, f) => sum + f.balance, 0) / forecast.length;
    return `Your forecast looks like this: average balance in the next 30 days will be ₹${formatCurrency(
      avgBalance
    )}. This is based on your historical spending and income patterns. To improve it, consider increasing income or reducing discretionary expenses.`;
  }

  if (
    msg.includes("save") ||
    msg.includes("how can i save") ||
    msg.includes("reduce spending")
  ) {
    const expensesByCategory: { [key: string]: number } = {};
    monthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expensesByCategory[t.category] =
          (expensesByCategory[t.category] || 0) + t.amount;
      });

    const topCategory = Object.entries(expensesByCategory).sort(
      ([, a], [, b]) => b - a
    )[0];
    if (topCategory) {
      return `Your biggest expense category is ${
        topCategory[0]
      } with ₹${formatCurrency(
        topCategory[1]
      )}. Try reducing this by 10-15% - every ₹100 you save adds up! Small changes like cooking at home or using cheaper subscriptions can make a big difference.`;
    }
  }

  if (msg.includes("budget") || msg.includes("how much")) {
    const savingsRate =
      totalIncome > 0
        ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(0)
        : 0;
    return `In the last 30 days: Income: ₹${formatCurrency(
      totalIncome
    )}, Expenses: ₹${formatCurrency(
      totalExpenses
    )}. You're saving ${savingsRate}% of your income. The ideal is 20-30%. Keep working on it!`;
  }

  if (msg.includes("income") || msg.includes("earning")) {
    const avgMonthlyIncome = totalIncome;
    const transactions30 = monthTransactions.filter(
      (t) => t.type === "income"
    ).length;
    return `You've earned ₹${formatCurrency(
      totalIncome
    )} from ${transactions30} income transactions this month. To increase earnings, consider exploring new gig opportunities or upskilling in your field. Diversifying income is especially important for gig workers.`;
  }

  // Default helpful response
  const suggestions = [
    "I can help you with:\n- Spending limits\n- Budget advice\n- Savings tips\n- Income trends\n- Expense analysis",
    "Try asking me:\n- Can I spend ₹500 today?\n- How can I save more this week?\n- What's my budget?\n- Why is my forecast low?\n- What are my main expenses?",
    "Here are some quick wins:\n- Review subscriptions\n- Set spending limits\n- Track daily expenses\n- Plan for irregular income\n- Build emergency fund",
  ];

  return suggestions[Math.floor(Math.random() * suggestions.length)];
}

function extractAmount(text: string): number | null {
  const match = text.match(/₹?(\d+(?:,\d{3})*(?:\.\d{1,2})?|\d+)/);
  if (match) {
    return Number.parseInt(match[1].replace(/,/g, ""));
  }
  return null;
}
