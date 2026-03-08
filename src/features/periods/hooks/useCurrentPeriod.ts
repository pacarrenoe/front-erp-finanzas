import { useQuery } from "@tanstack/react-query"
import http from "../../../api/http"

export function useCurrentPeriod() {

  return useQuery({

    queryKey: ["current-period"],

    queryFn: async () => {

      const { data } =
        await http.get("/periods/current")

      return data.data

    }

  })

}