import { useQuery } from "@tanstack/react-query";
import { getPeriods } from "../services/period.service";

export function usePeriods() {
  return useQuery({
    queryKey: ["periods"],
    queryFn: getPeriods,
  });
}