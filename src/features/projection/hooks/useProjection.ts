import { useQuery } from "@tanstack/react-query"
import { getProjection } from "../services/projection.service"

export function useProjection(periods = 6) {

  return useQuery({

    queryKey: ["projection", periods],

    queryFn: () => getProjection(periods)

  })

}