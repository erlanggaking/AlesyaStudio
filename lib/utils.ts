import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Manual format untuk hindari hydration mismatch (Intl.NumberFormat
// pakai NBSP di Node tapi regular space di browser tertentu).
export function formatIDR(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "Rp 0";
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const abs = Math.abs(rounded).toString();
  // Insert dot every 3 digits from the right
  const withDots = abs.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}Rp ${withDots}`;
}

export function formatCompact(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "0";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1).replace(/\.0$/, "")}jt`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1).replace(/\.0$/, "")}rb`;
  return `${sign}${abs}`;
}

export function formatPercent(value: number | null | undefined, digits = 1): string {
  if (value == null) return "0%";
  return `${value.toFixed(digits)}%`;
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  // Manual to avoid SSR/CSR Intl differences (locale data, NBSP, etc).
  const dateStyle = opts?.dateStyle ?? "medium";
  const timeStyle = opts?.timeStyle ?? "short";

  const day = d.getUTCDate().toString().padStart(2, "0");
  const monthsShort = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  const monthShort = monthsShort[d.getUTCMonth()];
  const year = d.getUTCFullYear();

  let datePart = "";
  if (dateStyle === "short") datePart = `${day}/${(d.getUTCMonth() + 1).toString().padStart(2, "0")}/${year}`;
  else if (dateStyle === "medium") datePart = `${day} ${monthShort} ${year}`;
  else datePart = `${day} ${monthShort} ${year}`;

  if (!timeStyle) return datePart;
  const hh = d.getUTCHours().toString().padStart(2, "0");
  const mm = d.getUTCMinutes().toString().padStart(2, "0");
  return `${datePart}, ${hh}:${mm}`;
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return `${seconds}d lalu`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}h lalu`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}bl lalu`;
  return `${Math.floor(months / 12)}th lalu`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
