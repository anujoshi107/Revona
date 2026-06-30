import React from "react";
import ChartLoadingState from "./charts/ChartLoadingState";
import OverviewChart from "./charts/OverviewChart";
import ExpenseBreakdownChart from "./charts/ExpenseBreakdownChart";

export default function DashboardPlaceholderCard({
  type,
  data = [],
  loading = false,
  extraData = {},
}) {
  if (loading) {
    return <ChartLoadingState />;
  }

  if (type === "overview") {
    return <OverviewChart data={data} extraData={extraData} />;
  }

  if (type === "breakdown") {
    return <ExpenseBreakdownChart data={data} />;
  }

  return null;
}