import http from "../../../api/http";

/* DASHBOARD ACTUAL */

export async function getDashboard() {
  const { data } = await http.get("/dashboard/current");
  return data.data;
}

/* DASHBOARD POR PERIODO */

export async function getDashboardByPeriod(periodId: string) {
  const { data } = await http.get(`/dashboard/period/${periodId}`);
  return data.data;
}

/* TENDENCIA */

export async function getTrend(n: number = 6) {
  const { data } = await http.get(`/dashboard/trend?n=${n}`);
  return data.data;
}