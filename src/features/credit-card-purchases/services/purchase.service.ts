import http from "../../../api/http"

export async function getPurchases(){

const { data } = await http.get("/credit-card-purchases")

return data.data

}

export async function createPurchase(payload:any){

const { data } = await http.post("/credit-card-purchases",payload)

return data.data

}

export async function deletePurchase(id:string){

await http.delete(`/credit-card-purchases/${id}`)

}