import { useQuery } from "@tanstack/react-query"
import { getDebtSchedule } from "../services/debt.service"

export function useDebtSchedule(debtId: string) {

  return useQuery({

    queryKey: ["debt-schedule", debtId],

    queryFn: () => getDebtSchedule(debtId),

    enabled: !!debtId

  })

}