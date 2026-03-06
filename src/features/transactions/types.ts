export type Direction = "IN" | "OUT"

export type PaymentMethod =
  | "CASH"
  | "DEBIT"
  | "CREDIT"
  | "TRANSFER"

export type Transaction = {
  id: string

  date: string
  description?: string
  amount: number

  direction: Direction

  account_id: string
  category_id: string

  payment_method: PaymentMethod
  merchant?: string

  account_name?: string
  category_name?: string
}

export type CreateTransactionDTO = {
  date: string
  description?: string
  amount: number
  direction: Direction
  account_id: string
  category_id: string
  payment_method: PaymentMethod
  merchant?: string
}

export type UpdateTransactionDTO = Partial<CreateTransactionDTO>