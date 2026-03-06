import http from "../../../api/http"
import type { Category } from "../types"

export async function getCategories(): Promise<Category[]> {

  const { data } = await http.get("/categories")

  return data?.data ?? data ?? []

}