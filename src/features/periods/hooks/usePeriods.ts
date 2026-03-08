import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query"

import {
getPeriods,
createPeriod,
deletePeriod,
updatePeriod,
getCurrentPeriod
} from "../services/period.service"

export function usePeriods(){

return useQuery({

queryKey:["periods"],

queryFn:getPeriods

})

}

export function useCurrentPeriod(){

return useQuery({

queryKey:["period-current"],

queryFn:getCurrentPeriod

})

}

export function usePeriodMutations(){

const qc = useQueryClient()

const createMut = useMutation({

mutationFn:createPeriod,

onSuccess:()=>{

qc.invalidateQueries({queryKey:["periods"]})

qc.invalidateQueries({queryKey:["period-current"]})

}

})

const updateMut = useMutation({

mutationFn:({id,data}:any)=>updatePeriod(id,data),

onSuccess:()=>{

qc.invalidateQueries({queryKey:["periods"]})

}

})

const deleteMut = useMutation({

mutationFn:deletePeriod,

onSuccess:()=>{

qc.invalidateQueries({queryKey:["periods"]})

}

})

return { createMut,updateMut,deleteMut }

}