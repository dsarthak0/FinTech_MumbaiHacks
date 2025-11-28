import { formatCurrency } from "@/lib/utils/format"
import { Card, CardContent } from "@/components/ui/card"
import { Budget } from "@/types"

interface Props {
  budget: Budget
}

export default function FinancialHealthCard({ budget }: Props) {
  const riskColor = {
    safe: "from-green-500 to-emerald-600",
    caution: "from-yellow-500 to-amber-600",
    danger: "from-red-500 to-rose-600",
  }[budget.riskLevel]

  const riskText = {
    safe: "Healthy",
    caution: "Needs attention",
    danger: "Critical",
  }[budget.riskLevel]

  return (
    <div className="px-4 py-4 space-y-3">
      <Card className="bg-linear-to-br from-blue-500 to-blue-600 border-0">
        <CardContent className="p-6 text-white">
          <p className="text-sm font-medium opacity-90 mb-2">Safe to Spend Today</p>
          <p className="text-4xl font-bold mb-4">{formatCurrency(budget.daily)}</p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-xs opacity-75">This Week</p>
              <p className="font-semibold">{formatCurrency(budget.remaining.thisWeek)}</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Risk Level</p>
              <p className="font-semibold">{riskText}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className={`bg-linear-to-r ${riskColor} rounded-lg p-4 text-white`}>
        <p className="text-sm font-medium">Financial Health: {riskText}</p>
        <p className="text-xs opacity-90 mt-1">
          {budget.riskLevel === "safe" && "Your finances are in good shape. Keep up the smart spending!"}
          {budget.riskLevel === "caution" && "Be mindful of your spending. Your balance needs attention."}
          {budget.riskLevel === "danger" && "Your finances need immediate attention. Reduce discretionary spending."}
        </p>
      </div>
    </div>
  )
}
