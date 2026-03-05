import { useMemo, useState } from "react"
import { useAccounts } from "../../features/accounts/hooks/useAccounts"
import { useAccountMutations } from "../../features/accounts/hooks/useAccountMutations"
import type { Account, AccountType } from "../../features/accounts/types"
import Card from "../../components/ui/Card/Card"
import Button from "../../components/ui/Button/Button"
import styles from "./Accounts.module.css"

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "DEBIT", label: "Débito" },
  { value: "CASH", label: "Efectivo" },
  { value: "CREDIT_CARD", label: "Tarjeta crédito" },
  { value: "CHECKING", label: "Cuenta corriente" },
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
  type: "DEBIT",
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

  const accounts = useMemo(() => (Array.isArray(data) ? data : []), [data])

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
      credit_limit: a.credit_limit != null ? String(a.credit_limit) : "",
      billing_day: a.billing_day != null ? String(a.billing_day) : "",
      due_day: a.due_day != null ? String(a.due_day) : "",
      active: a.active ?? true
    })
  }

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  function validate(): string | null {
    if (!form.name.trim()) return "El nombre es obligatorio"
    if (!form.type) return "El tipo es obligatorio"

    if (form.type === "CREDIT_CARD") {
      if (!form.last4.trim() || form.last4.trim().length !== 4) return "last4 debe tener 4 dígitos"
      if (form.billing_day && (+form.billing_day < 1 || +form.billing_day > 31)) return "billing_day inválido"
      if (form.due_day && (+form.due_day < 1 || +form.due_day > 31)) return "due_day inválido"
      if (form.credit_limit && +form.credit_limit < 0) return "credit_limit inválido"
    }

    return null
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) return alert(err) // si ya tienes toast, puedes cambiarlo a toast.error(err)

    const payload: any = {
      name: form.name.trim(),
      type: form.type,
      bank: form.bank.trim() || null,
      last4: form.type === "CREDIT_CARD" ? form.last4.trim() : null,
      credit_limit: form.type === "CREDIT_CARD" && form.credit_limit ? +form.credit_limit : null,
      billing_day: form.type === "CREDIT_CARD" && form.billing_day ? +form.billing_day : null,
      due_day: form.type === "CREDIT_CARD" && form.due_day ? +form.due_day : null,
      active: form.active
    }

    if (mode === "create") {
      await createMut.mutateAsync(payload)
      reset()
      return
    }

    if (mode === "edit" && editingId) {
      await updateMut.mutateAsync({ id: editingId, payload })
      reset()
    }
  }

  async function onDelete(id: string) {
    const ok = confirm("¿Eliminar esta cuenta?")
    if (!ok) return
    await deleteMut.mutateAsync(id)
    if (editingId === id) reset()
  }

  if (isLoading) return <p className={styles.state}>Cargando cuentas...</p>
  if (isError) return <p className={styles.state}>Error cargando cuentas</p>

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div>
          <h1 className={styles.title}>Cuentas</h1>
          <p className={styles.subtitle}>Administra débito, efectivo y tarjetas de crédito.</p>
        </div>

        <div className={styles.actions}>
          {mode === "edit" ? (
            <Button variant="ghost" onClick={reset}>
              Cancelar edición
            </Button>
          ) : null}
        </div>
      </div>

      <div className={styles.grid}>
        {/* FORM */}
        <Card>
          <form onSubmit={onSubmit} className={styles.form} aria-label="Formulario de cuentas">
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>{mode === "create" ? "Crear cuenta" : "Editar cuenta"}</h2>
            </div>

            <label className={styles.label}>
              Nombre
              <input
                className={styles.input}
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="Ej: Débito BancoEstado"
                autoComplete="off"
                required
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
              Banco (opcional)
              <input
                className={styles.input}
                value={form.bank}
                onChange={(e) => onChange("bank", e.target.value)}
                placeholder="Ej: BancoEstado"
                autoComplete="off"
              />
            </label>

            {form.type === "CREDIT_CARD" && (
              <>
                <div className={styles.row2}>
                  <label className={styles.label}>
                    Últimos 4 dígitos (last4)
                    <input
                      className={styles.input}
                      value={form.last4}
                      onChange={(e) => onChange("last4", e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="5555"
                      inputMode="numeric"
                      pattern="\d{4}"
                      maxLength={4}
                      required
                    />
                  </label>

                  <label className={styles.label}>
                    Cupo (opcional)
                    <input
                      className={styles.input}
                      value={form.credit_limit}
                      onChange={(e) => onChange("credit_limit", e.target.value.replace(/[^\d]/g, ""))}
                      placeholder="2000000"
                      inputMode="numeric"
                    />
                  </label>
                </div>

                <div className={styles.row2}>
                  <label className={styles.label}>
                    Día facturación (opcional)
                    <input
                      className={styles.input}
                      value={form.billing_day}
                      onChange={(e) => onChange("billing_day", e.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                      placeholder="5"
                      inputMode="numeric"
                    />
                  </label>

                  <label className={styles.label}>
                    Día vencimiento (opcional)
                    <input
                      className={styles.input}
                      value={form.due_day}
                      onChange={(e) => onChange("due_day", e.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                      placeholder="25"
                      inputMode="numeric"
                    />
                  </label>
                </div>
              </>
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
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                {mode === "create" ? "Crear" : "Guardar cambios"}
              </Button>

              {mode === "edit" ? (
                <Button type="button" variant="danger" onClick={() => editingId && onDelete(editingId)} disabled={deleteMut.isPending}>
                  Eliminar
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        {/* LIST */}
        <div className={styles.list}>
          {accounts.length === 0 ? (
            <Card>
              <p className={styles.empty}>Aún no tienes cuentas. Crea la primera arriba 👆</p>
            </Card>
          ) : (
            accounts.map((a) => (
              <Card key={a.id}>
                <div className={styles.item}>
                  <div className={styles.itemMain}>
                    <div className={styles.itemTitle}>
                      {a.name}{" "}
                      <span className={styles.badge}>{ACCOUNT_TYPES.find((t) => t.value === a.type)?.label ?? a.type}</span>
                    </div>

                    <div className={styles.itemMeta}>
                      {a.bank ? <span>{a.bank}</span> : <span className={styles.muted}>Sin banco</span>}
                      {a.type === "CREDIT_CARD" && a.last4 ? (
                        <span className={styles.mono}>•••• {a.last4}</span>
                      ) : null}
                      {a.active === false ? <span className={styles.inactive}>Inactiva</span> : null}
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <Button variant="ghost" onClick={() => startEdit(a)}>
                      Editar
                    </Button>
                    <Button variant="ghost" onClick={() => onDelete(a.id)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}