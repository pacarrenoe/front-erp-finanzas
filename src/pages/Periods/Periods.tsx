import { usePeriods, usePeriodMutations } from "../../features/periods/hooks/usePeriods"

import Card from "../../components/ui/Card/Card"

import Button from "../../components/ui/Button/Button"

import { useState } from "react"

import styles from "./Periods.module.css"

export default function Periods() {

  const { data: periods = [] } = usePeriods()

  const { createMut } = usePeriodMutations()

  const [form, setForm] = useState({

    salary_pay_date: "",
    base_salary_amount: ""

  })

  function change(key: string, value: any) {

    setForm(p => ({ ...p, [key]: value }))

  }

  async function submit(e: any) {

    e.preventDefault()

    await createMut.mutateAsync({

      salary_pay_date: form.salary_pay_date,

      base_salary_amount: Number(form.base_salary_amount)

    })

    setForm({

      salary_pay_date: "",
      base_salary_amount: ""

    })

  }

  return (

    <div className={styles.page}>

      <Card>

        <form onSubmit={submit} className={styles.form}>

          <h2>Nuevo período financiero</h2>

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

          <Button type="submit">

            Crear período

          </Button>

        </form>

      </Card>

      <div className={styles.list}>

        {periods.map((p: any) => (

          <Card key={p.id}>

            {new Date(p.start_date).toLocaleDateString()} - {new Date(p.end_date).toLocaleDateString()}

          </Card>

        ))}

      </div>

    </div>

  )

}