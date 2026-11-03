/**
 * Date and Timezone Utilities for Pawfect
 * Handles Indian Standard Time (IST, UTC+5:30), leap years (Feb 29),
 * year rollovers, and '7 days / 1 day before' reminder windows.
 */

export interface NextDateOccurrence {
  nextDate: Date;
  daysRemaining: number;
  isUpcomingWithin7Days: boolean;
  isUpcomingTomorrow: boolean;
  isToday: boolean;
  formattedDisplay: string;
}

export class DateService {
  /**
   * Checks whether a given year is a leap year.
   */
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /**
   * Calculates the next calendar occurrence of an annual recurring date (e.g. Month: 1-12, Day: 1-31).
   * Gracefully handles Feb 29: in non-leap years, falls back to Feb 28.
   * Handles year rollovers when the date has already passed in the current calendar year.
   */
  static getNextAnnualOccurrence(month: number, day: number, referenceDate: Date = new Date()): NextDateOccurrence {
    const currentYear = referenceDate.getFullYear();
    const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

    // Calculate candidate date for current year
    let targetDay = day;
    if (month === 2 && day === 29 && !this.isLeapYear(currentYear)) {
      targetDay = 28;
    }

    let candidate = new Date(currentYear, month - 1, targetDay);

    // If today is past the candidate date, rollover to next year
    if (candidate.getTime() < today.getTime()) {
      const nextYear = currentYear + 1;
      let nextYearDay = day;
      if (month === 2 && day === 29 && !this.isLeapYear(nextYear)) {
        nextYearDay = 28;
      }
      candidate = new Date(nextYear, month - 1, nextYearDay);
    }

    const diffMs = candidate.getTime() - today.getTime();
    const daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const formattedDisplay = `${candidate.getDate()} ${months[candidate.getMonth()]} ${candidate.getFullYear()}`;

    return {
      nextDate: candidate,
      daysRemaining,
      isUpcomingWithin7Days: daysRemaining > 0 && daysRemaining <= 7,
      isUpcomingTomorrow: daysRemaining === 1,
      isToday: daysRemaining === 0,
      formattedDisplay,
    };
  }

  /**
   * Returns human relative description: "Today!", "Tomorrow", "In 5 days", or "In 4 months".
   */
  static formatRelativeDays(daysRemaining: number): string {
    if (daysRemaining === 0) return 'Today!';
    if (daysRemaining === 1) return 'Tomorrow';
    if (daysRemaining < 7) return `In ${daysRemaining} days`;
    if (daysRemaining <= 30) return `In ${Math.ceil(daysRemaining / 7)} weeks`;
    return `In ${Math.round(daysRemaining / 30)} months`;
  }

  /**
   * Formats ISO timestamp to Indian Standard Time localized format (e.g. 24 Oct 2024, 2:30 PM).
   */
  static formatIST(dateInput: string | Date): string {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  }
}
