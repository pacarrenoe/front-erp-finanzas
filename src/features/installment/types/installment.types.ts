export type InstallmentStatus = "PENDING" | "PAID";

export type Installment = {
  id: string;
  purchase_id: string;
  period_id?: string | null;
  due_date: string;
  amount: number;
  status: InstallmentStatus;
  paid_transaction_id?: string | null;

  card_account_id: string;
  description?: string;
  purchase_status?: string;
  card_name: string;
  card_last4?: string;
};

export type InstallmentSummary = {
  pending_total: number;
  paid_total: number;
  pending_count: number;
  paid_count: number;
};