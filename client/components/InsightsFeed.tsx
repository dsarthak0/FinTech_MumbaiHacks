"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Insight } from "@/types"

interface Props {
  insights: Insight[]
  onDismiss: (id: string) => void
}

export default function InsightsFeed({ insights, onDismiss }: Props) {
  if (insights.length === 0) {
    return null
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "savings_tip":
        return "💰"
      case "subscription_alert":
        return "📱"
      case "spending_warning":
        return "⚠️"
      case "anomaly":
        return "🔍"
      case "income_trend":
        return "📈"
      default:
        return "💡"
    }
  }

  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-semibold mb-3">AI Insights</h2>
      <div className="space-y-3">
        {insights.map((insight) => (
          <Card key={insight.id} className="overflow-hidden border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xl">{getInsightIcon(insight.type)}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{insight.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    {insight.action && (
                      <button className="text-xs font-medium text-blue-600 mt-2 hover:underline">
                        {insight.action}
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDismiss(insight.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Dismiss insight"
                >
                  ✕
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
