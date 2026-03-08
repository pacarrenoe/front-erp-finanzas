import { useMemo, useState } from "react"
import toast from "react-hot-toast"

import {
  usePeriods,
  usePeriodMutations
} from "../../features/periods/hooks/usePeriods"

import Card from "../../components/ui/Card/Card"
import Button from "../../components/ui/Button/Button"

import styles from "./Periods.module.css"

function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function countBusinessDays(start: string, end: string) {
  const current = new Date(`${start}T00:00:00`)
  const endDate = new Date(`${end}T00:00:00`)

  let count = 0

  while (current <= endDate) {
    const day = current.getDay()

    if (day !== 0 && day !== 6) {
      count++
    }

    current.setDate(current.getDate() + 1)
  }

  return count
}

export default function Periods() {
  const { data: periods = [] } = usePeriods()
  const { createMut, updateMut, deleteMut } = usePeriodMutations()

  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    salary_pay_date: "",
    base_salary_amount: "",
    days_worked: "",
    pluxee_per_day: "5000",
    notes: ""
  })

  function change(key: string, value: any) {
    setForm(p => ({ ...p, [key]: value }))
  }

  function resetForm() {
    setEditingId(null)
    setForm({
      salary_pay_date: "",
      base_salary_amount: "",
      days_worked: "",
      pluxee_per_day: "5000",
      notes: ""
    })
  }

  const preview = useMemo(() => {
    if (!form.salary_pay_date) {
      return {
        endDate: "",
        businessDays: 0,
        effectiveDaysWorked: 0,
        pluxeeAmount: 0
      }
    }

    const endDate = addDays(form.salary_pay_date, 30)
    const businessDays = countBusinessDays(form.salary_pay_date, endDate)
    const effectiveDaysWorked = form.days_worked
      ? Number(form.days_worked)
      : businessDays

    const pluxeeAmount = form.pluxee_per_day
      ? effectiveDaysWorked * Number(form.pluxee_per_day)
      : 0

    return {
      endDate,
      businessDays,
      effectiveDaysWorked,
      pluxeeAmount
    }
  }, [form.salary_pay_date, form.days_worked, form.pluxee_per_day])

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    if (editingId) {
      await updateMut.mutateAsync({
        id: editingId,
        data: {
          days_worked: form.days_worked ? Number(form.days_worked) : undefined,
          pluxee_per_day: form.pluxee_per_day
            ? Number(form.pluxee_per_day)
            : undefined,
          notes: form.notes || undefined
        }
      })

      toast.success("Periodo actualizado")
      resetForm()
      return
    }

    await createMut.mutateAsync({
      salary_pay_date: form.salary_pay_date,
      base_salary_amount: Number(form.base_salary_amount),
      days_worked: form.days_worked ? Number(form.days_worked) : undefined,
      pluxee_per_day: form.pluxee_per_day
        ? Number(form.pluxee_per_day)
        : undefined,
      notes: form.notes || undefined
    })

    toast.success("Periodo creado")
    resetForm()
  }

  async function remove(id: string) {
    await deleteMut.mutateAsync(id)
    toast.success("Periodo eliminado")
  }

  function editPeriod(p: any) {
    setEditingId(p.id)
    setForm({
      salary_pay_date: p.salary_pay_date?.slice(0, 10) ?? "",
      base_salary_amount: String(p.base_salary_amount ?? ""),
      days_worked: p.days_worked ? String(p.days_worked) : "",
      pluxee_per_day: p.pluxee_per_day ? String(p.pluxee_per_day) : "5000",
      notes: p.notes ?? ""
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <Card>
          <form onSubmit={submit} className={styles.form}>
            <h2>{editingId ? "Editar periodo" : "Nuevo periodo"}</h2>

            <input
              type="date"
              value={form.salary_pay_date}
              onChange={e => change("salary_pay_date", e.target.value)}
              required
              disabled={!!editingId}
            />

            <input
              type="number"
              placeholder="Sueldo base"
              value={form.base_salary_amount}
              onChange={e => change("base_salary_amount", e.target.value)}
              required
              disabled={!!editingId}
            />

            <input
              type="number"
              placeholder="Dias trabajados (opcional)"
              value={form.days_worked}
              onChange={e => change("days_worked", e.target.value)}
            />

            <input
              type="number"
              placeholder="Pluxee por día"
              value={form.pluxee_per_day}
              onChange={e => change("pluxee_per_day", e.target.value)}
            />

            <input
              placeholder="Notas"
              value={form.notes}
              onChange={e => change("notes", e.target.value)}
            />

            {!!form.salary_pay_date && (
              <div className={styles.preview}>
                <div className={styles.previewItem}>
                  <span>Fin estimado</span>
                  <strong>
                    {new Date(preview.endDate).toLocaleDateString()}
                  </strong>
                </div>

                <div className={styles.previewItem}>
                  <span>Días hábiles</span>
                  <strong>{preview.businessDays}</strong>
                </div>

                <div className={styles.previewItem}>
                  <span>Días usados</span>
                  <strong>{preview.effectiveDaysWorked}</strong>
                </div>

                <div className={styles.previewItem}>
                  <span>Pluxee estimado</span>
                  <strong>${preview.pluxeeAmount.toLocaleString("es-CL")}</strong>
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <Button type="submit">
                {editingId ? "Guardar cambios" : "Crear"}
              </Button>

              {editingId && (
                <button
                  type="button"
                  className={styles.cancel}
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </Card>

        <div className={styles.tableWrapper}>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <span>Inicio</span>
              <span>Fin</span>
              <span>Sueldo</span>
              <span>Días</span>
              <span>Pluxee</span>
              <span>Notas</span>
              <span></span>
            </div>

            {periods.map((p: any) => (
              <div key={p.id} className={styles.row}>
                <span>{new Date(p.start_date).toLocaleDateString()}</span>
                <span>{new Date(p.end_date).toLocaleDateString()}</span>
                <span>${Number(p.base_salary_amount).toLocaleString("es-CL")}</span>
                <span>{p.days_worked ?? "-"}</span>
                <span>${Number(p.pluxee_amount ?? 0).toLocaleString("es-CL")}</span>
                <span>{p.notes ?? "-"}</span>

                <div className={styles.rowActions}>
                  <button
                    className={styles.edit}
                    onClick={() => editPeriod(p)}
                  >
                    Editar
                  </button>

                  <button
                    className={styles.delete}
                    onClick={() => remove(p.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}