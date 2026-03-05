export type AccountType =
  | "DEBIT"
  | "CASH"
  | "CREDIT_CARD"
  | "CHECKING"
  | "SAVINGS"

export type Account = {
  id: string
  name: string
  type: AccountType
  currency?: string | null
  last4?: string | null
  bank?: string | null
  credit_limit?: number | null
  billing_day?: number | null
  due_day?: number | null
  active?: boolean
}