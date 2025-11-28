"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { ForecastData } from "@/types"

interface Props {
  forecast: ForecastData[]
}

export default function CashflowChart({ forecast }: Props) {
  const last14Days = forecast.slice(0, 14)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const dateValue = typeof data.date === "string" ? data.date : new Date(data.date).toISOString().split("T")[0]
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{formatDate(dateValue)}</p>
          <p className="text-xs text-green-600">Inflow: {formatCurrency(data.predictedInflow)}</p>
          <p className="text-xs text-red-600">Outflow: {formatCurrency(data.predictedOutflow)}</p>
          <p className="text-xs font-bold text-blue-600 mt-1">Balance: {formatCurrency(data.balance)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="px-4 py-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">30-Day Cashflow Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last14Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="balance" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
