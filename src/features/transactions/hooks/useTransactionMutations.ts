import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createTransaction,
  updateTransaction,
  deleteTransaction
} from "../services/transaction.service"

export function useTransactionMutations() {

  const qc = useQueryClient()

  const createMut = useMutation({

    mutationFn: createTransaction,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] })
    }

  })

  const updateMut = useMutation({

    mutationFn: ({ id, payload }: any) =>
      updateTransaction(id, payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] })
    }

  })

  const deleteMut = useMutation({

    mutationFn: deleteTransaction,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] })
    }

  })

  return {
    createMut,
    updateMut,
    deleteMut
  }
}