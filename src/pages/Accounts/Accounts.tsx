import { useMemo, useState } from "react"

import { useAccounts } from "../../features/accounts/hooks/useAccounts"
import { useAccountMutations } from "../../features/accounts/hooks/useAccountMutations"

import type { Account, AccountType } from "../../features/accounts/types"

import Card from "../../components/ui/Card/Card"
import Button from "../../components/ui/Button/Button"
import AccountCard from "../../components/finance/AccountCard/AccountCard"

import styles from "./Accounts.module.css"
import Loader from "../../components/ui/Loader/Loader"


const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "DEBIT", label: "Tarjeta débito" },
  { value: "CASH", label: "Efectivo" },
  { value: "CREDIT_CARD", label: "Tarjeta crédito" },
  { value: "SAVINGS", label: "Ahorro" }
]


type FormState = {
  name: string
  type: AccountType
  bank: string
  last4: string
  credit_limit: string
  billing_day: string
  due_day: string
  active: boolean
}


const emptyForm: FormState = {
  name: "",
  type: "CASH",
  bank: "",
  last4: "",
  credit_limit: "",
  billing_day: "",
  due_day: "",
  active: true
}


export default function Accounts() {

  const { data, isLoading, isError } = useAccounts()
  const { createMut, updateMut, deleteMut } = useAccountMutations()

  const accounts = useMemo(() => data ?? [], [data])

  const [mode, setMode] = useState<"create" | "edit">("create")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)


  function reset() {
    setMode("create")
    setEditingId(null)
    setForm(emptyForm)
  }


  function startEdit(a: Account) {

    setMode("edit")
    setEditingId(a.id)

    setForm({
      name: a.name ?? "",
      type: a.type ?? "DEBIT",
      bank: a.bank ?? "",
      last4: a.last4 ?? "",
      credit_limit: a.credit_limit ? String(a.credit_limit) : "",
      billing_day: a.billing_day ? String(a.billing_day) : "",
      due_day: a.due_day ? String(a.due_day) : "",
      active: a.active ?? true
    })
  }


  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }))
  }


  function validate(): string | null {

    if (!form.name.trim())
      return "El nombre es obligatorio"

    if (form.type === "DEBIT" || form.type === "CREDIT_CARD") {

      if (!form.last4 || form.last4.length !== 4)
        return "Los últimos 4 dígitos son obligatorios"
    }

    return null
  }


  async function onSubmit(e: React.FormEvent) {

    e.preventDefault()

    const err = validate()

    if (err) {
      alert(err)
      return
    }

    const payload: any = {

      name: form.name.trim(),
      type: form.type,
      currency: "CLP",
      bank: form.bank || undefined,
      active: form.active
    }

    if (form.type === "DEBIT") {
      payload.last4 = form.last4
    }

    if (form.type === "CREDIT_CARD") {

      payload.last4 = form.last4

      if (form.credit_limit)
        payload.credit_limit = Number(form.credit_limit)

      if (form.billing_day)
        payload.billing_day = Number(form.billing_day)

      if (form.due_day)
        payload.due_day = Number(form.due_day)
    }


    if (mode === "create") {

      await createMut.mutateAsync(payload)
      reset()
      return
    }

    if (mode === "edit" && editingId) {

      await updateMut.mutateAsync({
        id: editingId,
        payload
      })

      reset()
    }
  }


  async function onDelete(id: string) {

    const ok = confirm("¿Eliminar esta cuenta?")

    if (!ok) return

    await deleteMut.mutateAsync(id)

    if (editingId === id)
      reset()
  }



  if (isLoading)
    return (
      <div className={styles.page}>
        <Loader />
      </div>
    )

  if (isError)
    return <p className={styles.state}>Error cargando cuentas</p>



  return (

    <div className={styles.page}>

      <div className={styles.top}>

        <div>
          <h1 className={styles.title}>Cuentas</h1>
          <p className={styles.subtitle}>
            Administra tus cuentas financieras
          </p>
        </div>

        {mode === "edit" && (
          <Button variant="ghost" onClick={reset}>
            Cancelar edición
          </Button>
        )}

      </div>



      <div className={styles.grid}>

        {/* FORMULARIO */}

        <Card>

          <form onSubmit={onSubmit} className={styles.form}>

            <h2 className={styles.formTitle}>
              {mode === "create" ? "Crear cuenta" : "Editar cuenta"}
            </h2>


            <label className={styles.label}>
              Nombre

              <input
                className={styles.input}
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="Ej: Débito BancoEstado"
              />
            </label>


            <label className={styles.label}>
              Tipo

              <select
                className={styles.input}
                value={form.type}
                onChange={(e) => onChange("type", e.target.value as AccountType)}
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>


            <label className={styles.label}>
              Banco

              <input
                className={styles.input}
                value={form.bank}
                onChange={(e) => onChange("bank", e.target.value)}
                placeholder="Ej: BancoEstado"
              />
            </label>


            {(form.type === "DEBIT" || form.type === "CREDIT_CARD") && (

              <label className={styles.label}>
                Últimos 4 dígitos

                <input
                  className={styles.input}
                  value={form.last4}
                  onChange={(e) =>
                    onChange(
                      "last4",
                      e.target.value.replace(/\D/g, "").slice(0, 4)
                    )
                  }
                  placeholder="1234"
                />

              </label>

            )}


            {form.type === "CREDIT_CARD" && (

              <label className={styles.label}>
                Cupo tarjeta

                <input
                  className={styles.input}
                  value={form.credit_limit}
                  onChange={(e) =>
                    onChange(
                      "credit_limit",
                      e.target.value.replace(/[^\d]/g, "")
                    )
                  }
                  placeholder="2000000"
                />

              </label>

            )}


            <label className={styles.checkbox}>

              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => onChange("active", e.target.checked)}
              />

              Activa

            </label>


            <div className={styles.formActions}>

              <Button
                type="submit"
                disabled={createMut.isPending || updateMut.isPending}
              >
                {mode === "create" ? "Crear" : "Guardar"}
              </Button>


              {mode === "edit" && (

                <Button
                  type="button"
                  variant="danger"
                  onClick={() => editingId && onDelete(editingId)}
                  disabled={deleteMut.isPending}
                >
                  Eliminar
                </Button>

              )}

            </div>

          </form>

        </Card>



        {/* LISTA DE CUENTAS */}

        <div className={styles.list}>

          {accounts.length === 0 ? (

            <Card>
              <p className={styles.empty}>
                Aún no tienes cuentas. Crea la primera 👆
              </p>
            </Card>

          ) : (

            accounts.map((a) => (

              <AccountCard
                key={a.id}
                account={a}
                onEdit={startEdit}
                onDelete={onDelete}
              />

            ))

          )}

        </div>

      </div>

    </div>
  )
}