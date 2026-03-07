import { useMutation, useQueryClient } from "@tanstack/react-query"
import { markSchedulePaid } from "../services/debt.service"

type PayPayload = {
  scheduleId: string
  accountId: string
  method: "CASH" | "DEBIT" | "CREDIT" | "TRANSFER"
}

export function useScheduleMutations(){

  const qc = useQueryClient()

  const payMut = useMutation({

    mutationFn:(payload: PayPayload)=>{

      return markSchedulePaid(payload.scheduleId,{
        account_id: payload.accountId,
        payment_method: payload.method
      })

    },

    onSuccess:()=>{

      qc.invalidateQueries({queryKey:["debts"]})
      qc.invalidateQueries({queryKey:["transactions"]})
      qc.invalidateQueries({queryKey:["debt-schedule"]})

    }

  })

  return { payMut }

}