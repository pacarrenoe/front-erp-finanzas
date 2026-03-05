import { http } from "../api/http"

export type LoginDTO = {
  email: string
  password: string
}

export async function loginRequest(data: LoginDTO) {

  const response = await http.post("/auth/login", data)

  return response.data

}