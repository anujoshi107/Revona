import mongoose from "mongoose";

export const ReportStatusEnum = {
  SENT: "SENT",
  PENDING: "PENDING",
  FAILED: "FAILED",
  NO_ACTIVITY: "NO_ACTIVITY",
};

const topCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    percent: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    period: {
      type: String,
      required: true,
    },

    fromDate: {
      type: Date,
    },

    toDate: {
      type: Date,
    },

    sentDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ReportStatusEnum),
      default: ReportStatusEnum.PENDING,
    },

    summary: {
      income: {
        type: Number,
        default: 0,
      },
      expenses: {
        type: Number,
        default: 0,
      },
      balance: {
        type: Number,
        default: 0,
      },
      savingsRate: {
        type: Number,
        default: 0,
      },
      topCategories: {
        type: [topCategorySchema],
        default: [],
      },
    },

    insights: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ReportModel = mongoose.model("Report", reportSchema);

export default ReportModel;