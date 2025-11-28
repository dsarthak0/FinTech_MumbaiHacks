// Mock AI insights generation system

import { Insight, Transaction } from "@/types";


export function generateInsights(transactions: Transaction[]): Insight[] {
  const insights: Insight[] = [];

  // Analyze spending patterns
  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const recentExpenses = expenseTransactions.filter(
    (t) => t.timestamp > last30Days.getTime()
  );

  // Insight 1: High spending category
  const categorySpending: { [key: string]: number } = {};
  recentExpenses.forEach((t) => {
    categorySpending[t.category] =
      (categorySpending[t.category] || 0) + t.amount;
  });

  const highestCategory = Object.entries(categorySpending).sort(
    ([, a], [, b]) => b - a
  )[0];
  if (highestCategory && highestCategory[1] > 5000) {
    insights.push({
      id: `insight-${Date.now()}-1`,
      type: "spending_warning",
      title: "High Spending Alert",
      description: `You spent ₹${highestCategory[1]} on ${highestCategory[0]} this month. Consider reducing this category.`,
      action: "Set a limit",
      actionType: "primary",
      dismissed: false,
      createdAt: Date.now(),
    });
  }

  // Insight 2: Subscription check
  const subscriptions = recentExpenses.filter(
    (t) =>
      t.category === "Subscriptions" ||
      t.description.toLowerCase().includes("subscription") ||
      t.description.toLowerCase().includes("netflix") ||
      t.description.toLowerCase().includes("spotify")
  );

  if (subscriptions.length > 0) {
    const subscriptionTotal = subscriptions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    insights.push({
      id: `insight-${Date.now()}-2`,
      type: "subscription_alert",
      title: "Subscription Review Recommended",
      description: `You have ₹${subscriptionTotal} in active subscriptions. Review and cancel unused ones.`,
      action: "Review subscriptions",
      actionType: "secondary",
      dismissed: false,
      createdAt: Date.now(),
    });
  }

  // Insight 3: Savings opportunity
  const totalExpenses = recentExpenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions
    .filter((t) => t.type === "income" && t.timestamp > last30Days.getTime())
    .reduce((sum, t) => sum + t.amount, 0);

  if (totalIncome > 0 && totalExpenses / totalIncome > 0.7) {
    insights.push({
      id: `insight-${Date.now()}-3`,
      type: "savings_tip",
      title: "Increase Your Savings Rate",
      description: `You're spending ${Math.round(
        (totalExpenses / totalIncome) * 100
      )}% of your income. Try to keep it below 70%.`,
      action: "View suggestions",
      actionType: "secondary",
      dismissed: false,
      createdAt: Date.now(),
    });
  }

  // Insight 4: Unusual transaction
  const avgExpense =
    recentExpenses.reduce((sum, t) => sum + t.amount, 0) /
    Math.max(1, recentExpenses.length);
  const unusualTransactions = recentExpenses.filter(
    (t) => t.amount > avgExpense * 3
  );

  if (unusualTransactions.length > 0) {
    const latestUnusual = unusualTransactions[0];
    insights.push({
      id: `insight-${Date.now()}-4`,
      type: "anomaly",
      title: "Unusual Transaction Detected",
      description: `You spent ₹${latestUnusual.amount} on ${latestUnusual.category}. This is 3x your average.`,
      action: "Review",
      actionType: "secondary",
      dismissed: false,
      createdAt: Date.now(),
    });
  }

  // Insight 5: Income trend
  const incomeTransactions = transactions.filter((t) => t.type === "income");
  if (incomeTransactions.length >= 3) {
    const recentIncome = incomeTransactions
      .filter((t) => t.timestamp > last30Days.getTime())
      .reduce((sum, t) => sum + t.amount, 0);
    const prevIncome = incomeTransactions
      .filter(
        (t) =>
          t.timestamp >
            new Date(
              last30Days.getTime() - 30 * 24 * 60 * 60 * 1000
            ).getTime() && t.timestamp <= last30Days.getTime()
      )
      .reduce((sum, t) => sum + t.amount, 0);

    if (recentIncome > prevIncome && prevIncome > 0) {
      insights.push({
        id: `insight-${Date.now()}-5`,
        type: "income_trend",
        title: "Income Growth Detected",
        description: `Your income increased by ₹${
          recentIncome - prevIncome
        } compared to last month. Great progress!`,
        action: "View trends",
        actionType: "secondary",
        dismissed: false,
        createdAt: Date.now(),
      });
    }
  }

  return insights.slice(0, 5); // Return top 5 insights
}
