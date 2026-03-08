import { useQuery } from "@tanstack/react-query";
import {
  getDashboard,
  getTrend,
} from "../services/dashboard.service";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard", "current"],
    queryFn: getDashboard,
  });
}

export function useDashboardTrend(n = 6) {
  return useQuery({
    queryKey: ["dashboard", "trend", n],
    queryFn: () => getTrend(n),
  });
}