import cron from "node-cron";
import { processRecurringTransactions } from "./jobs/transaction.job.js";
import { processReportJob } from "./jobs/report.job.js";

const scheduleJob = (name, time, job) => {
  console.log(`Scheduling ${name} at ${time}`);

  return cron.schedule(
    time,
    async () => {
      try {
        await job();
        console.log(`${name} completed`);
      } catch (error) {
        console.log(`${name} failed`, error);
      }
    },
    {
      scheduled: true,
      timezone: "UTC",
    }
  );
};

export const startJobs = () => {
  return [
    scheduleJob("Transactions", "5 0 * * *", processRecurringTransactions),

    // Run at 2:30 AM UTC on the 1st day of every month
    scheduleJob("Reports", "30 2 1 * *", processReportJob),
  ];
};