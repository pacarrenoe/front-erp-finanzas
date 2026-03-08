import http from "../../../api/http"

export async function getPeriods(){

const { data } = await http.get("/periods")

return data.data

}

export async function getCurrentPeriod(){

const { data } = await http.get("/periods/current")

return data.data

}

export async function createPeriod(payload:any){

const { data } = await http.post("/periods",payload)

return data.data

}

export async function updatePeriod(id:string,payload:any){

const { data } = await http.patch(`/periods/${id}`,payload)

return data.data

}

export async function deletePeriod(id:string){

const { data } = await http.delete(`/periods/${id}`)

return data.data

}