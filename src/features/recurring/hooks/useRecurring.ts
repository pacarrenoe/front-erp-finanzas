import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getRecurring,
  createRecurring,
  deleteRecurring,
  toggleRecurring
} from "../services/recurring.service"

export function useRecurring(){

  const qc = useQueryClient()

  const query = useQuery({

    queryKey:["recurring"],

    queryFn:getRecurring

  })

  const createMut = useMutation({

    mutationFn:createRecurring,

    onSuccess:()=>{

      qc.invalidateQueries({queryKey:["recurring"]})

    }

  })

  const deleteMut = useMutation({

    mutationFn:deleteRecurring,

    onSuccess:()=>{

      qc.invalidateQueries({queryKey:["recurring"]})

    }

  })

  const toggleMut = useMutation({

    mutationFn:toggleRecurring,

    onSuccess:()=>{

      qc.invalidateQueries({queryKey:["recurring"]})

    }

  })

  return{

    ...query,

    createMut,
    deleteMut,
    toggleMut

  }

}