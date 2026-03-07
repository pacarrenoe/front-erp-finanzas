export type DebtDirection =
  | "I_OWE"
  | "OWE_ME"

export interface Debt {

  id:string

  direction:DebtDirection

  counterparty_name:string

  description?:string

  principal_amount:number

  created_at:string
}

export interface CreateDebtDTO {

  direction:DebtDirection

  counterparty_name:string

  description?:string

  principal_amount:number

  installments:number

  first_due_date:string
}