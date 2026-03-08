import http from "../../../api/http"
import type { BudgetRule } from "../types/budget.types"

export async function getBudget(periodId: string) {

  const { data } =
    await http.get(`/budget?periodId=${periodId}`)

  return data.data as BudgetRule[]

}

export async function createBudgetRule(data: {

  category_id: string
  limit_amount: number
  alert_threshold_pct: number

}) {

  const res =
    await http.post("/budget", data)

  return res.data.data

}

export async function deleteBudgetRule(id: string) {

  await http.delete(`/budget/${id}`)

}