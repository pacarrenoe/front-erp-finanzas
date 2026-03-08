import { useState } from "react"

import { useBudget } from "../../features/budget/hooks/useBudget"
import { useBudgetMutations } from "../../features/budget/hooks/useBudgetMutations"

import { useCategories } from "../../features/categories/hooks/useCategories"
import { useCurrentPeriod } from "../../features/periods/hooks/useCurrentPeriod"

import Card from "../../components/ui/Card/Card"
import Button from "../../components/ui/Button/Button"

import styles from "./Budget.module.css"

export default function Budget(){

  const { data: period } = useCurrentPeriod()

  const periodId = period?.id

  const { data: rules = [] } =
    useBudget(periodId)

  const { data: categories = [] } =
    useCategories()

  const { createMut, deleteMut } =
    useBudgetMutations()

  const [form,setForm] = useState({
    category_id:"",
    limit_amount:"",
    alert_threshold_pct:"80"
  })

  function change(key:string,value:any){
    setForm(p=>({...p,[key]:value}))
  }

  async function submit(e:React.FormEvent){

    e.preventDefault()

    await createMut.mutateAsync({
      category_id:form.category_id,
      limit_amount:Number(form.limit_amount),
      alert_threshold_pct:Number(form.alert_threshold_pct)
    })

    setForm({
      category_id:"",
      limit_amount:"",
      alert_threshold_pct:"0"
    })
  }

  return(

    <div className={styles.page}>

      <div className={styles.grid}>

        <Card>

          <form onSubmit={submit} className={styles.form}>

            <h2>Nueva regla de presupuesto</h2>

            <select
              value={form.category_id}
              onChange={(e)=>change("category_id",e.target.value)}
              required
            >
              <option value="">Categoría</option>

              {categories.map((c:any)=>(
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}

            </select>

            <input
              type="number"
              placeholder="Límite mensual"
              value={form.limit_amount}
              onChange={(e)=>change("limit_amount",e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Alerta %"
              value={form.alert_threshold_pct}
              onChange={(e)=>change("alert_threshold_pct",e.target.value)}
            />

            <Button type="submit">
              Crear regla
            </Button>

          </form>

        </Card>

        <div>

          <div className={styles.list}>

            <div className={styles.tableHeader}>
              <span>Categoría</span>
              <span>Límite</span>
              <span>Gastado</span>
              <span>Restante</span>
              <span>Uso</span>
              <span></span>
            </div>

            {rules.map((r:any)=>(

              <div key={r.id} className={styles.row}>

                <span>{r.category_name}</span>

                <span>${r.limit_amount}</span>

                <span>${r.spent_amount}</span>

                <span>${r.remaining_amount}</span>

                <span>

                  {r.percent_used}%

                </span>

                <button
                  className={styles.delete}
                  onClick={()=>deleteMut.mutate(r.id)}
                >
                  Eliminar
                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )

}