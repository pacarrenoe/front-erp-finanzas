import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createDebt,
  deleteDebt,
  updateDebt
} from "../services/debt.service"

export function useDebtMutations(){

  const qc = useQueryClient()

  const createMut = useMutation({

    mutationFn:createDebt,

    onSuccess:()=>{

      qc.invalidateQueries({queryKey:["debts"]})

    }

  })

  const deleteMut = useMutation({

    mutationFn:deleteDebt,

    onSuccess:()=>{

      qc.invalidateQueries({queryKey:["debts"]})

    }

  })

  const updateMut = useMutation({

    mutationFn:({id,data}:{id:string,data:any})=>updateDebt(id,data),

    onSuccess:()=>{

      qc.invalidateQueries({queryKey:["debts"]})

    }

  })

  return{

    createMut,

    deleteMut,

    updateMut

  }

}