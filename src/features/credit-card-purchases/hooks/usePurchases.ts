import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query"

import {
getPurchases,
createPurchase,
deletePurchase,
getPurchaseSummary
} from "../services/purchase.service"

export function usePurchases(){

const qc = useQueryClient()

const query = useQuery({

queryKey:["purchases"],
queryFn:getPurchases

})

const summary = useQuery({

queryKey:["purchases-summary"],
queryFn:getPurchaseSummary

})

const createMut = useMutation({

mutationFn:createPurchase,

onSuccess:()=>{

qc.invalidateQueries({queryKey:["purchases"]})
qc.invalidateQueries({queryKey:["purchases-summary"]})

}

})

const deleteMut = useMutation({

mutationFn:deletePurchase,

onSuccess:()=>{

qc.invalidateQueries({queryKey:["purchases"]})
qc.invalidateQueries({queryKey:["purchases-summary"]})

}

})

return{

...query,
summary,
createMut,
deleteMut

}

}