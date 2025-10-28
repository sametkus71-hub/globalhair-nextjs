// Date formatting and duration helpers for Zoho Bookings API

/**
 * Convert ISO date string to Zoho format: dd-MMM-yyyy HH:mm:ss
 * Example: "2024-01-15T14:30:00Z" -> "15-Jan-2024 14:30:00"
 */
export function toZohoDateFormat(isoDate: string): string {
  const date = new Date(isoDate);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Convert Zoho format to ISO date string
 * Example: "15-Jan-2024 14:30:00" -> "2024-01-15T14:30:00.000Z"
 */
export function fromZohoDateFormat(zohoDate: string): string {
  // Parse: dd-MMM-yyyy HH:mm:ss
  const [datePart, timePart] = zohoDate.split(' ');
  const [day, month, year] = datePart.split('-');
  const [hours, minutes, seconds] = timePart.split(':');
  
  const monthMap: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  };
  
  const monthNum = monthMap[month];
  const isoString = `${year}-${monthNum}-${day}T${hours}:${minutes}:${seconds}.000Z`;
  
  return isoString;
}

/**
 * Add minutes to an ISO date string
 */
export function addMinutes(isoDate: string, minutes: number): string {
  const date = new Date(isoDate);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

/**
 * Format date for Zoho API queries (YYYY-MM-DD)
 */
export function toZohoQueryDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get date range for availability queries (today + 30 days)
 */
export function getAvailabilityDateRange(): { from: string; to: string } {
  const today = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(today.getDate() + 30);
  
  return {
    from: toZohoQueryDate(today),
    to: toZohoQueryDate(thirtyDaysLater),
  };
}
