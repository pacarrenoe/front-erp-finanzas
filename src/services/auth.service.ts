import http from "../api/http"

export type LoginDTO = {
  email: string
  password: string
}

export function registerRequest(data:any){

return http.post("/auth/register",data)

}

export function loginRequest(data:any){

return http.post("/auth/login",data)

}