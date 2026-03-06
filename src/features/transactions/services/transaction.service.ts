import http from "../../../api/http"
import type {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO
} from "../types"

export async function getTransactions(): Promise<Transaction[]> {

  const { data } = await http.get("/transactions")

  return data?.data ?? []
}

export async function getTransaction(id: string): Promise<Transaction> {

  const { data } = await http.get(`/transactions/${id}`)

  return data.data
}

export async function createTransaction(
  payload: CreateTransactionDTO
): Promise<Transaction> {

  const { data } = await http.post("/transactions", payload)

  return data.data
}

export async function updateTransaction(
  id: string,
  payload: UpdateTransactionDTO
): Promise<Transaction> {

  const { data } = await http.put(`/transactions/${id}`, payload)

  return data.data
}

export async function deleteTransaction(id: string): Promise<void> {

  await http.delete(`/transactions/${id}`)
}