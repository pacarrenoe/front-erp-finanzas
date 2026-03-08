import http from "../../../api/http";

export async function getDashboard() {
  const { data } = await http.get("/dashboard/current");
  return data.data;
}

export async function getDashboardByPeriod(periodId: string) {
  const { data } = await http.get(`/dashboard/period/${periodId}`);
  return data.data;
}

export async function getTrend(n = 6) {
  const { data } = await http.get(`/dashboard/trend?n=${n}`);
  return data.data;
}