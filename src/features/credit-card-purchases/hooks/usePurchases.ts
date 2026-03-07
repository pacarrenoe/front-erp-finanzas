import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query"
import { getPurchases,createPurchase,deletePurchase } from "../services/purchase.service"

export function usePurchases(){

const qc = useQueryClient()

const query = useQuery({

queryKey:["purchases"],
queryFn:getPurchases

})

const createMut = useMutation({

mutationFn:createPurchase,

onSuccess:()=>{

qc.invalidateQueries({queryKey:["purchases"]})

}

})

const deleteMut = useMutation({

mutationFn:deletePurchase,

onSuccess:()=>{

qc.invalidateQueries({queryKey:["purchases"]})

}

})

return{

...query,
createMut,
deleteMut

}

}