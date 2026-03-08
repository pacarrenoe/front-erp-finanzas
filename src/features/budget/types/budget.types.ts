export type BudgetRule = {

  id: string

  category_id: string
  category_name: string

  limit_amount: number
  alert_threshold_pct: number

  spent_amount: number
  remaining_amount: number
  percent_used: number

  alert: boolean

}