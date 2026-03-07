import { useMutation, useQueryClient } from "@tanstack/react-query"
import { markSchedulePaid } from "../services/debt.service"

export function useScheduleMutations() {

  const qc = useQueryClient()

  const payMut = useMutation({

    mutationFn: (scheduleId: string) => markSchedulePaid(scheduleId),

    onSuccess: () => {

      qc.invalidateQueries({ queryKey: ["debt-schedule"] })
      qc.invalidateQueries({ queryKey: ["debts"] })

    }

  })

  return { payMut }

}