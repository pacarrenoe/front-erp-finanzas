import { useTransactions } from "../../transactions/hooks/useTransactions"
import { useAccounts } from "../../accounts/hooks/useAccounts"

export function useDashboard(){

  const { data: transactions = [] } = useTransactions()
  const { data: accounts = [] } = useAccounts()

  const income = transactions
  .filter((t:any)=>t.direction === "IN")
  .reduce((sum:number,t:any)=>sum + t.amount,0)

  const expense = transactions
  .filter((t:any)=>t.direction === "OUT")
  .reduce((sum:number,t:any)=>sum + t.amount,0)

  const balance = income - expense

  return{
    income,
    expense,
    balance,
    accounts
  }

}