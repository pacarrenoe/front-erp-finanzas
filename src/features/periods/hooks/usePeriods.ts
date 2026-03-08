import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getPeriods, createPeriod, getCurrentPeriod } from "../services/period.service"

export function usePeriods() {

  return useQuery({

    queryKey: ["periods"],

    queryFn: getPeriods

  })

}

export function useCurrentPeriod() {

  return useQuery({

    queryKey: ["period-current"],

    queryFn: getCurrentPeriod

  })

}

export function usePeriodMutations() {

  const qc = useQueryClient()

  const createMut = useMutation({

    mutationFn: createPeriod,

    onSuccess: () => {

      qc.invalidateQueries({ queryKey: ["periods"] })

      qc.invalidateQueries({ queryKey: ["period-current"] })

    }

  })

  return { createMut }

}