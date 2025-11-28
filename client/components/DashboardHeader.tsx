import { formatDate } from "@/lib/utils/format"

export default function DashboardHeader() {
  const today = new Date()
  const greeting = getGreeting()

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-3xl font-bold text-foreground mb-1">{greeting}</h1>
      <p className="text-muted-foreground">{formatDate(today)}</p>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}
