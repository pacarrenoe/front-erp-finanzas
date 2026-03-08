import http from "../../../api/http"

export async function getCategories() {
  const { data } = await http.get("/categories")
  return data.data
}

export async function createCategory(payload: any) {
  const { data } = await http.post("/categories", payload)
  return data.data
}

export async function updateCategory(id: string, payload: any) {
  const { data } = await http.patch(`/categories/${id}`, payload)
  return data.data
}

export async function deleteCategory(id: string) {
  const { data } = await http.delete(`/categories/${id}`)
  return data.data
}