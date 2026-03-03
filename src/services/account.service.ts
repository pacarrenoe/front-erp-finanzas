import { http } from "../api/http";

export type Account = {
  id: string;
  name: string;
  type: "DEBIT" | "CASH" | "CREDIT_CARD" | "CHECKING" | "SAVINGS";
  currency: string;
  bank: string | null;
  last4: string | null;
  active: boolean;
  created_at: string;
};

export async function listAccounts(): Promise<Account[]> {
  const { data } = await http.get<Account[]>("/accounts");
  return data;
}