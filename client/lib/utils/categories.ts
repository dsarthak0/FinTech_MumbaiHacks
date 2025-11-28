// Category utility functions

export const autoCategorizeTransaction = (description: string): string => {
  const desc = description.toLowerCase();

  if (
    desc.includes("food") ||
    desc.includes("restaurant") ||
    desc.includes("lunch") ||
    desc.includes("dinner") ||
    desc.includes("coffee")
  ) {
    return "Food & Dining";
  }
  if (
    desc.includes("uber") ||
    desc.includes("ola") ||
    desc.includes("fuel") ||
    desc.includes("transport") ||
    desc.includes("taxi")
  ) {
    return "Transport";
  }
  if (
    desc.includes("netflix") ||
    desc.includes("spotify") ||
    desc.includes("amazon") ||
    desc.includes("subscription") ||
    desc.includes("adobe")
  ) {
    return "Subscriptions";
  }
  if (
    desc.includes("shopping") ||
    desc.includes("mall") ||
    desc.includes("amazon shopping") ||
    desc.includes("flipkart")
  ) {
    return "Shopping";
  }
  if (
    desc.includes("electricity") ||
    desc.includes("water") ||
    desc.includes("internet") ||
    desc.includes("utilities")
  ) {
    return "Utilities";
  }
  if (
    desc.includes("doctor") ||
    desc.includes("medicine") ||
    desc.includes("hospital") ||
    desc.includes("healthcare")
  ) {
    return "Healthcare";
  }

  // Default based on amount (heuristic)
  return "Shopping";
};
