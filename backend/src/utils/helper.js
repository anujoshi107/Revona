import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  startOfMonth,
} from 'date-fns';

// Import the enum from the transaction model
import TransactionModel from '../models/transaction.model.js';
const RecurringIntervalEnum = TransactionModel.RecurringIntervalEnum;

export function calculateNextReportDate(lastSentDate) {
  const now = new Date();

  const lastSent = lastSentDate ? new Date(lastSentDate) : now;

  let nextDate = startOfMonth(addMonths(lastSent, 1));
  nextDate.setHours(0, 0, 0, 0);

  // If calculated next date is still in the past,
  // schedule next report from current month instead
  if (nextDate <= now) {
    nextDate = startOfMonth(addMonths(now, 1));
    nextDate.setHours(0, 0, 0, 0);
  }

  return nextDate;
}

export function calculateNextOccurrence(date, recurringInterval) {
  const base = new Date(date);
  base.setHours(0, 0, 0, 0);

  switch (recurringInterval) {
    case RecurringIntervalEnum.DAILY:
      return addDays(base, 1);
    case RecurringIntervalEnum.WEEKLY:
      return addWeeks(base, 1);
    case RecurringIntervalEnum.MONTHLY:
      return addMonths(base, 1);
    case RecurringIntervalEnum.YEARLY:
      return addYears(base, 1);
    default:
      return base;
  }
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
