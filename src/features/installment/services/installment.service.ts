import http from "../../../api/http";
import type { Installment, InstallmentSummary } from "../types/installment.types";

export async function getInstallments(params?: {
  periodId?: string;
  status?: "PENDING" | "PAID" | "";
}): Promise<Installment[]> {
  const { data } = await http.get("/installments", {
    params: {
      periodId: params?.periodId || undefined,
      status: params?.status || undefined,
    },
  });

  return data.data ?? [];
}

export async function getCurrentInstallments(periodId: string): Promise<Installment[]> {
  const { data } = await http.get("/installments/current", {
    params: { periodId },
  });

  return data.data ?? [];
}

export async function getInstallmentsSummary(periodId: string): Promise<InstallmentSummary> {
  const { data } = await http.get("/installments/summary", {
    params: { periodId },
  });

  return data.data;
}

export async function markInstallmentPaid(
  id: string,
  payload?: { paid_transaction_id?: string }
): Promise<Installment> {
  const { data } = await http.patch(`/installments/${id}/mark-paid`, payload ?? {});
  return data.data;
}