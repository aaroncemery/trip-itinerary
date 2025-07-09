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

  try {
    // Parse the date string as UTC (since Sanity stores in UTC)
    // If the string already ends with 'Z', don't add another one
    const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    const utcDate = new Date(utcString);

    // Check if the date is valid
    if (isNaN(utcDate.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '';
    }

    // Format with default options if none provided
    const defaultOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      ...options,
    };

    return utcDate.toLocaleTimeString('en-US', defaultOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
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

  try {
    // Parse the date string as UTC (since Sanity stores in UTC)
    // If the string already ends with 'Z', don't add another one
    const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    const utcDate = new Date(utcString);

    // Check if the date is valid
    if (isNaN(utcDate.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '';
    }

    // Format with default options if none provided
    const defaultOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };

    return utcDate.toLocaleDateString('en-US', defaultOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
