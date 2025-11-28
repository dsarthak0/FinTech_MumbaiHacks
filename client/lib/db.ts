// Mock database with in-memory storage for MVP
import type { Transaction, Category, Insight } from "./types";

// Mock categories
const defaultCategories: Category[] = [
  {
    id: "1",
    name: "Food & Dining",
    type: "expense",
    color: "from-orange-400 to-orange-600",
    icon: "🍔",
  },
  {
    id: "2",
    name: "Transport",
    type: "expense",
    color: "from-blue-400 to-blue-600",
    icon: "🚗",
  },
  {
    id: "3",
    name: "Subscriptions",
    type: "expense",
    color: "from-purple-400 to-purple-600",
    icon: "📱",
  },
  {
    id: "4",
    name: "Shopping",
    type: "expense",
    color: "from-pink-400 to-pink-600",
    icon: "🛍️",
  },
  {
    id: "5",
    name: "Utilities",
    type: "expense",
    color: "from-amber-400 to-amber-600",
    icon: "💡",
  },
  {
    id: "6",
    name: "Healthcare",
    type: "expense",
    color: "from-red-400 to-red-600",
    icon: "🏥",
  },
  {
    id: "7",
    name: "Gig Work Income",
    type: "income",
    color: "from-green-400 to-green-600",
    icon: "💼",
  },
  {
    id: "8",
    name: "Freelance",
    type: "income",
    color: "from-emerald-400 to-emerald-600",
    icon: "💻",
  },
];

// Mock transactions
const mockTransactions: Transaction[] = [
  {
    id: "t1",
    type: "income",
    amount: 15000,
    category: "Gig Work Income",
    description: "Delivery job - 2 hours",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: "t2",
    type: "expense",
    amount: 450,
    category: "Food & Dining",
    description: "Lunch with team",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: "t3",
    type: "expense",
    amount: 300,
    category: "Transport",
    description: "Fuel",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "t4",
    type: "income",
    amount: 8000,
    category: "Freelance",
    description: "Web design project",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: "t5",
    type: "expense",
    amount: 999,
    category: "Subscriptions",
    description: "Netflix, Spotify, Adobe",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: "t6",
    type: "expense",
    amount: 5000,
    category: "Shopping",
    description: "Laptop bag and accessories",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
];

class MockDatabase {
  private transactions: Transaction[] = [...mockTransactions];
  private categories: Category[] = defaultCategories;
  private insights: Insight[] = [];

  // Transactions
  getTransactions(): Transaction[] {
    return this.transactions.sort((a, b) => b.timestamp - a.timestamp);
  }

  addTransaction(
    transaction: Omit<Transaction, "id" | "timestamp">
  ): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: `t${Date.now()}`,
      timestamp: Date.now(),
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  getTransactionsByDateRange(startDate: Date, endDate: Date): Transaction[] {
    return this.transactions.filter(
      (t) =>
        t.timestamp >= startDate.getTime() && t.timestamp <= endDate.getTime()
    );
  }

  // Categories
  getCategories(): Category[] {
    return this.categories;
  }

  getCategoriesByType(type: "expense" | "income"): Category[] {
    return this.categories.filter((c) => c.type === type);
  }

  // Insights
  getInsights(): Insight[] {
    return this.insights.sort((a, b) => b.createdAt - a.createdAt);
  }

  addInsight(insight: Omit<Insight, "id" | "createdAt">): Insight {
    const newInsight: Insight = {
      ...insight,
      id: `ins${Date.now()}`,
      createdAt: Date.now(),
    };
    this.insights.push(newInsight);
    return newInsight;
  }

  dismissInsight(id: string): void {
    const insight = this.insights.find((i) => i.id === id);
    if (insight) {
      insight.dismissed = true;
    }
  }

  getActiveInsights(): Insight[] {
    return this.insights.filter((i) => !i.dismissed);
  }
}

export const db = new MockDatabase();
