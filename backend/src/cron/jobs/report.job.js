import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import mongoose from "mongoose";

import ReportSettingModel from "../../models/reportsettings.model.js";
import { generateReportService } from "../../services/report.service.js";
import ReportModel, { ReportStatusEnum } from "../../models/report.model.js";
import { calculateNextReportDate } from "../../utils/helper.js";
import { sendReportEmail } from "../../mailers/report.mailer.js";

export const processReportJob = async () => {
  const now = new Date();

  let processedCount = 0;
  let failedCount = 0;

  // If today is July 1, generate report for June 1 - June 30
 const from = startOfMonth(subMonths(now, 1));
const to = endOfMonth(subMonths(now, 1));
  try {
    const reportSettingCursor = ReportSettingModel.find({
    isEnabled: true,
    nextReportDate: { $lte: now },
  })
  .populate("userId")
  .cursor();

    console.log("Running report job");

    for await (const setting of reportSettingCursor) {
      const user = setting.userId;

      if (!user || !user.email) {
        console.log(`User not found for setting: ${setting._id}`);
        continue;
      }

      const session = await mongoose.startSession();

      try {
        const result = await generateReportService(user._id, from, to);

        // generateReportService returns: { report: savedReport }
        const report = result?.report || null;

        let emailSent = false;

        if (report) {
          try {
            await sendReportEmail({
              email: user.email,
              username: user.name,
              report: {
                period: report.period,
                totalIncome: report.summary.income,
                totalExpenses: report.summary.expenses,
                availableBalance: report.summary.balance,
                savingsRate: report.summary.savingsRate,
                topSpendingCategories: report.summary.topCategories,
                insights: report.insights,
              },
              frequency: setting.frequency,
            });

            emailSent = true;
          } catch (error) {
            console.log(`Email failed for ${user._id}`, error);
          }
        }

        await session.withTransaction(
          async () => {
            if (report && emailSent) {
              await ReportModel.updateOne(
                { _id: report._id },
                {
                  $set: {
                    status: ReportStatusEnum.SENT,
                    sentDate: now,
                  },
                },
                { session }
              );

              await ReportSettingModel.updateOne(
                { _id: setting._id },
                {
                  $set: {
                    lastSentDate: now,
                    nextReportDate: calculateNextReportDate(now),
                  },
                },
                { session }
              );
            } else if (report && !emailSent) {
              await ReportModel.updateOne(
                { _id: report._id },
                {
                  $set: {
                    status: ReportStatusEnum.FAILED,
                    sentDate: now,
                  },
                },
                { session }
              );

              await ReportSettingModel.updateOne(
                { _id: setting._id },
                {
                  $set: {
                    lastSentDate: null,
                    nextReportDate: calculateNextReportDate(now),
                  },
                },
                { session }
              );
            } else {
              await ReportModel.create(
                [
                  {
                    userId: user._id,
                    sentDate: now,
                    period: `${format(from, "MMMM d")} - ${format(
                      to,
                      "d, yyyy"
                    )}`,
                    status: ReportStatusEnum.NO_ACTIVITY,
                  },
                ],
                { session }
              );

              await ReportSettingModel.updateOne(
                { _id: setting._id },
                {
                  $set: {
                    lastSentDate: null,
                    nextReportDate: calculateNextReportDate(now),
                  },
                },
                { session }
              );
            }
          },
          {
            maxCommitTimeMS: 10000,
          }
        );

        processedCount++;
      } catch (error) {
        console.log("Failed to process report", error);
        failedCount++;
      } finally {
        await session.endSession();
      }
    }

    console.log(`✅ Processed: ${processedCount} report`);
    console.log(`❌ Failed: ${failedCount} report`);

    return {
      success: true,
      processedCount,
      failedCount,
    };
  } catch (error) {
    console.error("Error processing reports", error);

    return {
      success: false,
      error: "Report process failed",
    };
  }
};