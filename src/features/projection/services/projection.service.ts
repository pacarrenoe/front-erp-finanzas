import http from "../../../api/http"
import type { ProjectionPeriod } from "../types/projection.types"

export async function getProjection(periods = 6) {

  const { data } =
    await http.get(`/projection?periods=${periods}`)

  return data.data as ProjectionPeriod[]

}