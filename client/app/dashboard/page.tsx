"use client"

import AddTransactionModal from "@/components/AddTransactionModal"
import CashflowChart from "@/components/CashflowChart"
import ChatBot from "@/components/ChatBot"
import DashboardHeader from "@/components/DashboardHeader"
import FinancialHealthCard from "@/components/FinancialHealthCard"
import InsightsFeed from "@/components/InsightsFeed"
import Navigation from "@/components/Navigation"
import { generateInsights } from "@/lib/ai/insightsGenerator"
import { db } from "@/lib/db"
import { calculateRiskLevel, generateCashflowForecast, getDailyBudget } from "@/lib/ml/cashflowPredictor"
import { Budget, ForecastData, Insight, Transaction } from "@/types"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [forecast, setForecast] = useState<ForecastData[]>([])
  const [budget, setBudget] = useState<Budget | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense")

  useEffect(() => {
    // Load initial data
    const allTransactions = db.getTransactions()
    setTransactions(allTransactions)

    // Generate forecast
    const newForecast = generateCashflowForecast(allTransactions)
    setForecast(newForecast)

    // Calculate budget
    const riskLevel = calculateRiskLevel(newForecast)
    const dailyBudget = getDailyBudget(newForecast, allTransactions)
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())

    const weekExpenses = allTransactions
      .filter((t) => t.type === "expense" && t.timestamp >= weekStart.getTime())
      .reduce((sum, t) => sum + t.amount, 0)

    setBudget({
      daily: dailyBudget,
      weekly: dailyBudget * 7,
      remaining: {
        today: dailyBudget,
        thisWeek: Math.max(0, dailyBudget * 7 - weekExpenses),
      },
      riskLevel,
    })

    // Generate insights
    const newInsights = generateInsights(allTransactions)
    newInsights.forEach((insight) => {
      db.addInsight({
        type: insight.type,
        title: insight.title,
        description: insight.description,
        action: insight.action,
        actionType: insight.actionType,
        dismissed: false,
      })
    })
    setInsights(db.getActiveInsights())
  }, [])

  const handleAddTransaction = (type: "income" | "expense") => {
    setTransactionType(type)
    setShowAddModal(true)
  }

  const handleTransactionAdded = () => {
    const allTransactions = db.getTransactions()
    setTransactions(allTransactions)

    // Recalculate forecast and budget
    const newForecast = generateCashflowForecast(allTransactions)
    setForecast(newForecast)

    const riskLevel = calculateRiskLevel(newForecast)
    const dailyBudget = getDailyBudget(newForecast, allTransactions)

    setBudget({
      daily: dailyBudget,
      weekly: dailyBudget * 7,
      remaining: {
        today: dailyBudget,
        thisWeek: dailyBudget * 7,
      },
      riskLevel,
    })
    setShowAddModal(false)
  }

  const handleDismissInsight = (id: string) => {
    db.dismissInsight(id)
    setInsights(db.getActiveInsights())
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        onAddExpense={() => handleAddTransaction("expense")}
        onAddIncome={() => handleAddTransaction("income")}
      />

      <main className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 sm:mb-10 pt-6">
            <DashboardHeader />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Financial Health Card - Full width on mobile */}
            {budget && (
              <div className="lg:col-span-1">
                <FinancialHealthCard budget={budget} />
              </div>
            )}

            {/* Quick Stats Cards */}
            {budget && (
              <>
                <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-lg p-6 border border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Daily Budget</p>
                  <h3 className="text-3xl font-bold text-foreground">₹{budget.daily.toFixed(2)}</h3>

                  <p className="text-xs text-muted-foreground mt-2">
                    {budget.remaining.today > 0 ? "Remaining today" : "Over budget"}
                  </p>
                </div>

                <div className="bg-linear-to-br from-accent/10 to-accent/5 rounded-lg p-6 border border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Weekly Limit</p>
                  <h3 className="text-3xl font-bold text-foreground">₹{budget.remaining.thisWeek.toFixed(2)}</h3>
                  <p className="text-xs text-muted-foreground mt-2">Remaining this week</p>
                </div>
              </>
            )}
          </div>

          {forecast.length > 0 && (
            <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Cashflow Forecast</h2>
              <CashflowChart forecast={forecast} />
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Financial Insights</h2>
            <InsightsFeed insights={insights} onDismiss={handleDismissInsight} />
          </div>
        </div>
      </main>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <AddTransactionModal
          type={transactionType}
          onClose={() => setShowAddModal(false)}
          onAdd={handleTransactionAdded}
        />
      )}

      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-24 right-6 z-40 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        aria-label="Open AI Chat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {showChat && <ChatBot transactions={transactions} forecast={forecast} onClose={() => setShowChat(false)} />}
    </div>
  )
} 