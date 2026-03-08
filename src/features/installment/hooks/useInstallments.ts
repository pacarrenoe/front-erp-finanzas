import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInstallments,
  getInstallmentsSummary,
  markInstallmentPaid,
} from "../services/installment.service";

export function useInstallments(filters?: {
  periodId?: string;
  status?: "PENDING" | "PAID" | "";
}) {
  return useQuery({
    queryKey: ["installments", filters?.periodId ?? "", filters?.status ?? ""],
    queryFn: () => getInstallments(filters),
  });
}

export function useInstallmentsSummary(periodId?: string) {
  return useQuery({
    queryKey: ["installments-summary", periodId ?? ""],
    queryFn: () => getInstallmentsSummary(periodId as string),
    enabled: !!periodId,
  });
}

export function useInstallmentMutations() {
  const qc = useQueryClient();

  const payMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: { paid_transaction_id?: string } }) =>
      markInstallmentPaid(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["installments"] });
      qc.invalidateQueries({ queryKey: ["installments-summary"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["purchases"] });
      qc.invalidateQueries({ queryKey: ["purchases-summary"] });
    },
  });

  return { payMut };
}