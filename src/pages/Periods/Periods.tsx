import { useState } from "react"

import toast from "react-hot-toast"

import {
  usePeriods,
  usePeriodMutations
} from "../../features/periods/hooks/usePeriods"

import Card from "../../components/ui/Card/Card"

import Button from "../../components/ui/Button/Button"

import styles from "./Periods.module.css"

export default function Periods() {

  const { data: periods = [] } = usePeriods()

  const { createMut, deleteMut } = usePeriodMutations()

  const [form, setForm] = useState({

    salary_pay_date: "",
    base_salary_amount: "",
    days_worked: "",
    pluxee_per_day: "",
    notes: ""

  })

  function change(key: string, value: any) {

    setForm(p => ({ ...p, [key]: value }))

  }

  async function submit(e: any) {

    e.preventDefault()

    await createMut.mutateAsync({

      salary_pay_date: form.salary_pay_date,

      base_salary_amount: Number(form.base_salary_amount),

      days_worked: form.days_worked ? Number(form.days_worked) : undefined,

      pluxee_per_day: form.pluxee_per_day ? Number(form.pluxee_per_day) : undefined,

      notes: form.notes || undefined

    })

    setForm({

      salary_pay_date: "",
      base_salary_amount: "",
      days_worked: "",
      pluxee_per_day: "",
      notes: ""

    })

  }

  async function remove(id: string) {

    await deleteMut.mutateAsync(id)

    toast.success("Periodo eliminado")

  }

  return (

    <div className={styles.page}>

      <div className={styles.grid}>

        <Card>

          <form onSubmit={submit} className={styles.form}>

            <h2>Nuevo periodo</h2>

            <input
              type="date"
              value={form.salary_pay_date}
              onChange={e => change("salary_pay_date", e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Sueldo base"
              value={form.base_salary_amount}
              onChange={e => change("base_salary_amount", e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Dias trabajados"
              value={form.days_worked}
              onChange={e => change("days_worked", e.target.value)}
            />

            <input
              type="number"
              placeholder="Pluxee por dia"
              value={form.pluxee_per_day}
              onChange={e => change("pluxee_per_day", e.target.value)}
            />

            <input
              placeholder="Notas"
              value={form.notes}
              onChange={e => change("notes", e.target.value)}
            />

            <Button type="submit">
              Crear
            </Button>

          </form>

        </Card>

        <div>

          <div className={styles.tableHeader}>
            <span>Inicio</span>
            <span>Fin</span>
            <span>Sueldo</span>
            <span>Pluxee</span>
            <span>Notas</span>
            <span></span>
          </div>

          {periods.map((p: any) => (

            <div key={p.id} className={styles.row}>

              <span>{new Date(p.start_date).toLocaleDateString()}</span>

              <span>{new Date(p.end_date).toLocaleDateString()}</span>

              <span>${p.base_salary_amount}</span>

              <span>${p.pluxee_amount ?? 0}</span>

              <span>{p.notes ?? "-"}</span>

              <button
                className={styles.delete}
                onClick={() => remove(p.id)}
              >
                Eliminar
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}