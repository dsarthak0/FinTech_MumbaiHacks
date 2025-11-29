// lib/autoCategorize.ts
export function autoCategorizeTransaction(description: string): string {
  const desc = description.toLowerCase()
  if (desc.includes("uber") || desc.includes("bus") || desc.includes("train")) return "Transport"
  if (desc.includes("doctor") || desc.includes("medicine")) return "Healthcare"
  if (desc.includes("shopping") || desc.includes("mall")) return "Shopping"
  if (desc.includes("netflix") || desc.includes("spotify")) return "Subscriptions"
  if (desc.includes("electricity") || desc.includes("water") || desc.includes("internet")) return "Utilities"
  if (desc.includes("restaurant") || desc.includes("food") || desc.includes("coffee")) return "Food & Drinks"
  return "Other" // fallback category
}
