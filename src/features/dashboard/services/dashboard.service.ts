import http from "../../../api/http"

export async function getDashboard() {
  const { data } = await http.get("/dashboard/current")
  return data
}

export async function getTrend() {
  const { data } = await http.get("/dashboard/trend")
  return data
}