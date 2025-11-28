// Utility functions for formatting currency, dates, etc.

export const formatCurrency = (amount: number, currency = "₹"): string => {
  return `${currency}${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
};

export const formatDate = (date: Date | number | string): string => {
  let d: Date;
  if (typeof date === "string") {
    d = new Date(date);
  } else if (typeof date === "number") {
    d = new Date(date);
  } else {
    d = date;
  }
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

export const formatFullDate = (date: Date | number | string): string => {
  let d: Date;
  if (typeof date === "string") {
    d = new Date(date);
  } else if (typeof date === "number") {
    d = new Date(date);
  } else {
    d = date;
  }
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const getDateRange = (days = 30): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
};

export const getCurrentMonth = (): { start: Date; end: Date } => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { start, end };
};

export const getThisWeek = (): { start: Date; end: Date } => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};
