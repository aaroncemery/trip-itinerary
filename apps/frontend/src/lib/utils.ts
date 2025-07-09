import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { parseISO, isValid, format, addMinutes, isAfter } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to parse different date formats from Sanity
export function parseSanityDate(dateString: string): Date | null {
  if (!dateString) return null;

  // Try parsing as ISO first (handles "2025-07-10T21:28:00.000Z")
  if (dateString.includes('T') || dateString.includes('-')) {
    const isoDate = parseISO(dateString);
    if (isValid(isoDate)) return isoDate;
  }

  // Fall back to native Date parsing for formats like "Thu Jul 10 2025"
  const date = new Date(dateString);
  return isValid(date) ? date : null;
}

// Replace your formatSanityDateTime
export function formatSanityDateTime(dateString: string): string {
  const date = parseSanityDate(dateString);
  if (!date) return '';

  // Only format if it actually has time info
  if (!dateString.includes('T') && !dateString.includes(':')) {
    return '';
  }

  const userTimezone = 'America/Los_Angeles'; // or get dynamically
  const localDate = toZonedTime(date, userTimezone);
  return format(localDate, 'h:mm a');
}

// Replace your formatSanityDate
export function formatSanityDate(dateString: string): string {
  // For date headers, we just need to format the date string that's already converted
  // The dateString here is already a toDateString() result from the grouping
  const date = new Date(dateString);
  if (!isValid(date)) return '';

  return format(date, 'EEEE, MMMM d, yyyy');
}

// Check if an itinerary item should be desaturated (15+ minutes after start time)
export function shouldDesaturateItem(itemDate: string): boolean {
  const itemStartTime = parseSanityDate(itemDate);
  if (!itemStartTime) return false;

  const currentTime = new Date();
  const fifteenMinutesAfterStart = addMinutes(itemStartTime, 15);

  return isAfter(currentTime, fifteenMinutesAfterStart);
}
