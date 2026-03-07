import { useQuery } from "@tanstack/react-query";
import { getDebts } from "../services/debt.service";

export function useDebts() {
  return useQuery({
    queryKey: ["debts"],
    queryFn: getDebts,
  });
}