import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createBudgetRule,
  deleteBudgetRule
} from "../services/budget.service"

export function useBudgetMutations() {

  const qc = useQueryClient()

  const createMut = useMutation({

    mutationFn: createBudgetRule,

    onSuccess: () => {

      qc.invalidateQueries({ queryKey: ["budget"] })

    }

  })

  const deleteMut = useMutation({

    mutationFn: deleteBudgetRule,

    onSuccess: () => {

      qc.invalidateQueries({ queryKey: ["budget"] })

    }

  })

  return {
    createMut,
    deleteMut
  }

}