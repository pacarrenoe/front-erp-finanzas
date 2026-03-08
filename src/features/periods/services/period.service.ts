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