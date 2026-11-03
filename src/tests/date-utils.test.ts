import test from 'node:test';
import assert from 'node:assert/strict';
import { DateService } from '../services/date-utils';

test('DateService correctly determines leap years', () => {
  assert.equal(DateService.isLeapYear(2024), true);
  assert.equal(DateService.isLeapYear(2025), false);
  assert.equal(DateService.isLeapYear(2028), true);
  assert.equal(DateService.isLeapYear(1900), false);
  assert.equal(DateService.isLeapYear(2000), true);
});

test('DateService handles Feb 29 on non-leap years by falling back to Feb 28', () => {
  // Reference date: 1 Jan 2025 (non-leap year)
  const ref = new Date(2025, 0, 1);
  const occurrence = DateService.getNextAnnualOccurrence(2, 29, ref);

  assert.equal(occurrence.nextDate.getFullYear(), 2025);
  assert.equal(occurrence.nextDate.getMonth(), 1); // February (0-indexed)
  assert.equal(occurrence.nextDate.getDate(), 28);
});

test('DateService rolls over to next year when date has already passed', () => {
  // Reference date: 15 November 2024
  const ref = new Date(2024, 10, 15);
  // Target date: 10 January
  const occurrence = DateService.getNextAnnualOccurrence(1, 10, ref);

  assert.equal(occurrence.nextDate.getFullYear(), 2025);
  assert.equal(occurrence.nextDate.getMonth(), 0); // January
  assert.equal(occurrence.nextDate.getDate(), 10);
});

test('DateService identifies upcoming within 7 days and tomorrow', () => {
  // Reference date: 10 October 2024
  const ref = new Date(2024, 9, 10);

  // Target 1: Tomorrow (11 Oct)
  const tom = DateService.getNextAnnualOccurrence(10, 11, ref);
  assert.equal(tom.daysRemaining, 1);
  assert.equal(tom.isUpcomingTomorrow, true);
  assert.equal(tom.isUpcomingWithin7Days, true);

  // Target 2: 5 days away (15 Oct)
  const fiveDays = DateService.getNextAnnualOccurrence(10, 15, ref);
  assert.equal(fiveDays.daysRemaining, 5);
  assert.equal(fiveDays.isUpcomingWithin7Days, true);
  assert.equal(fiveDays.isUpcomingTomorrow, false);
});
