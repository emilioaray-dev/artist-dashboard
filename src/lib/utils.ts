import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and merges them with tailwind-merge
 * @param inputs Class values to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with commas as thousands separators
 */
export function formatNumber(num: number, locale = "en"): string {
  if (num >= 1_000_000) {
    const millions = num / 1_000_000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }
  if (num >= 1_000) {
    const thousands = num / 1_000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  }
  return num.toLocaleString(locale);
}

/**
 * Formats a number in cents to currency format
 */
export function formatCurrency(cents: number, locale = "en"): string {
  const dollars = cents / 100;
  const hasCents = cents % 100 !== 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(dollars);
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string, locale = "en"): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a percentage value
 */
export function formatPercentage(value: number, locale = "en"): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

/**
 * Converts a date string to a short formatted date string
 */
export function formatDateRange(dateStr: string, locale = "en"): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}
