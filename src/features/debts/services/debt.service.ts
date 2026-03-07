import http from "../../../api/http"
import type { CreateDebtDTO } from "../types"

/* GET ALL DEBTS */

export async function getDebts(){

  const res = await http.get("/debts")

  return res.data.data
}


/* GET ONE DEBT */

export async function getDebt(id:string){

  const res = await http.get(`/debts/${id}`)

  return res.data.data
}


/* CREATE DEBT */

export async function createDebt(data:CreateDebtDTO){

  const res = await http.post("/debts",data)

  return res.data.data
}


/* UPDATE DEBT */

export async function updateDebt(id:string,data:any){

  const res = await http.patch(`/debts/${id}`,data)

  return res.data.data
}


/* DELETE DEBT */

export async function deleteDebt(id:string){

  const res = await http.delete(`/debts/${id}`)

  return res.data.data
}


/* GET DEBT SCHEDULE */

export async function getDebtSchedule(debtId:string){

  const res = await http.get(`/debts/${debtId}/schedule`)

  return res.data.data
}


/* MARK INSTALLMENT AS PAID */

export async function markSchedulePaid(scheduleId:string){

  const res = await http.patch(`/debts/schedule/${scheduleId}/mark-paid`)

  return res.data.data
}