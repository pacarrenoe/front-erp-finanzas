import http from "../../../api/http"

export async function getRecurring(){

  const { data } = await http.get("/recurring")

  return data.data

}

export async function createRecurring(payload:any){

  const { data } = await http.post("/recurring",payload)

  return data.data

}

export async function deleteRecurring(id:string){

  const { data } = await http.delete(`/recurring/${id}`)

  return data.data

}

export async function toggleRecurring(id:string){

  const { data } = await http.patch(`/recurring/${id}/active`)

  return data.data

}