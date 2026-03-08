import { useQuery } from "@tanstack/react-query"
import { getBudget } from "../services/budget.service"

export function useBudget(periodId?: string) {

  return useQuery({

    queryKey: ["budget", periodId],

    enabled: !!periodId,

    queryFn: () => getBudget(periodId!)

  })

}