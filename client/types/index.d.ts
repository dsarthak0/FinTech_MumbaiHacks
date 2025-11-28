// Core TypeScript types for the finance app

export interface Transaction {
  id: string;
  type: "expense" | "income";
  amount: number;
  category: string;
  description: string;
  date: Date;
  timestamp: number;
}

export interface Category {
  id: string;
  name: string;
  type: "expense" | "income";
  color: string;
  icon: string;
}

export interface ForecastData {
  date: string;
  predictedInflow: number;
  predictedOutflow: number;
  safeToSpend: number;
  balance: number;
}

export interface Budget {
  daily: number;
  weekly: number;
  remaining: {
    today: number;
    thisWeek: number;
  };
  riskLevel: "safe" | "caution" | "danger";
}

export interface Insight {
  id: string;
  type:
    | "savings_tip"
    | "subscription_alert"
    | "spending_warning"
    | "anomaly"
    | "income_trend";
  title: string;
  description: string;
  action?: string;
  actionType?: "primary" | "secondary";
  dismissed: boolean;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface FinancialContext {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  averageDailySpend: number;
  categories: CategorySummary[];
}

export interface CategorySummary {
  category: string;
  total: number;
  percentage: number;
}
