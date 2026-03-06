import http from "../../../api/http"
import type { Account } from "../types"

export type CreateAccountDTO = Omit<Account, "id">
export type UpdateAccountDTO = Partial<Omit<Account, "id">>

export async function getAccounts(): Promise<Account[]> {

  const { data } = await http.get("/accounts")

  return data?.data ?? []

}

export async function createAccount(payload: CreateAccountDTO): Promise<Account> {

  const { data } = await http.post("/accounts", payload)

  return data?.data

}

export async function updateAccount(id: string, payload: UpdateAccountDTO): Promise<Account> {

  const { data } = await http.patch(`/accounts/${id}`, payload)

  return data?.data

}

export async function deleteAccount(id: string): Promise<void> {

  await http.delete(`/accounts/${id}`)

}