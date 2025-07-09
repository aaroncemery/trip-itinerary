import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a datetime string from Sanity as local time
 * Sanity stores datetime in UTC, so we need to parse it as UTC and convert to local
 */
export function formatSanityDateTime(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC', // <--- Force UTC!
    ...options,
  };
  return date.toLocaleTimeString('en-US', defaultOptions);
}

/**
 * Formats a date string from Sanity for display
 * Sanity stores datetime in UTC, so we need to parse it as UTC
 */
export function formatSanityDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC', // <--- Force UTC!
    ...options,
  };
  return date.toLocaleDateString('en-US', defaultOptions);
}
