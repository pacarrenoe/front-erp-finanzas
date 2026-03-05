import { http } from "../api/http";

export type DashboardCurrent = {
  incomeTotal: number;
  expenseTotal: number;
  commitmentsTotal: number;
  projectedBalance: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

export async function getDashboardCurrent() {
  const { data } = await http.get<DashboardCurrent>("/dashboard/current");
  return data;
}