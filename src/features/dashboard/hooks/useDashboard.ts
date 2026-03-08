import { useQuery } from "@tanstack/react-query";
import {
  getDashboard,
  getTrend
} from "../services/dashboard.service";

/* DASHBOARD ACTUAL */

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard", "current"],
    queryFn: getDashboard
  });
}

/* TENDENCIA */

export function useDashboardTrend(n: number = 6) {
  return useQuery({
    queryKey: ["dashboard", "trend", n],
    queryFn: () => getTrend(n)
  });
}