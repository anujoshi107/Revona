const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { convertToCents, convertToDollarUnit } = require('../utils/format-currency');

// Enums → plain objects
const TransactionStatusEnum = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

const RecurringIntervalEnum = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
};

const TransactionTypeEnum = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
};

const PaymentMethodEnum = {
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  MOBILE_PAYMENT: 'MOBILE_PAYMENT',
  AUTO_DEBIT: 'AUTO_DEBIT',
  CASH: 'CASH',
  OTHER: 'OTHER',
};

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionTypeEnum),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      // Convert dollars to cents when saving to DB
      set: (value) => convertToCents(value),
      // Convert cents back to dollars when reading
      get: (value) => convertToDollarUnit(value),
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    receiptUrl: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringInterval: {
      type: String,
      enum: Object.values(RecurringIntervalEnum),
      default: null,
    },
    nextRecurringDate: {
      type: Date,
      default: null,
    },
    lastProcessed: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatusEnum),
      default: TransactionStatusEnum.COMPLETED,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethodEnum),
      default: PaymentMethodEnum.CASH,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;
module.exports.RecurringIntervalEnum = RecurringIntervalEnum;