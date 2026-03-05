import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { createAccount, updateAccount, deleteAccount } from "../services/accounts.service"
import type { CreateAccountDTO, UpdateAccountDTO } from "../services/accounts.service"

export function useAccountMutations() {
  const qc = useQueryClient()

  const createMut = useMutation({
    mutationFn: (payload: CreateAccountDTO) => createAccount(payload),
    onSuccess: () => {
      toast.success("Cuenta creada")
      qc.invalidateQueries({ queryKey: ["accounts"] })
    },
    onError: () => toast.error("No se pudo crear la cuenta")
  })

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAccountDTO }) => updateAccount(id, payload),
    onSuccess: () => {
      toast.success("Cuenta actualizada")
      qc.invalidateQueries({ queryKey: ["accounts"] })
    },
    onError: () => toast.error("No se pudo actualizar")
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    onSuccess: () => {
      toast.success("Cuenta eliminada")
      qc.invalidateQueries({ queryKey: ["accounts"] })
    },
    onError: () => toast.error("No se pudo eliminar")
  })

  return { createMut, updateMut, deleteMut }
}