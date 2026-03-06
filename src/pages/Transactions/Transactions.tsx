import { useState } from "react"
import { useTransactions } from "../../features/transactions/hooks/useTransactions"
import { useTransactionMutations } from "../../features/transactions/hooks/useTransactionMutations"
import { useAccounts } from "../../features/accounts/hooks/useAccounts"
import { useCategories } from "../../features/categories/hooks/useCategories"

import Card from "../../components/ui/Card/Card"
import Button from "../../components/ui/Button/Button"

import styles from "./Transactions.module.css"

export default function Transactions() {

  const { data: transactions = [] } = useTransactions()
  const { data: accounts = [] } = useAccounts()
  const { data: categories = [] } = useCategories()

  const { createMut, deleteMut } = useTransactionMutations()

  const [formOpen, setFormOpen] = useState(true)

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    description: "",
    amount: "",
    direction: "OUT" as "IN" | "OUT",
    account_id: "",
    category_id: "",
    payment_method: "DEBIT" as "CASH" | "DEBIT" | "CREDIT" | "TRANSFER",
    merchant: ""
  })

  const [filters, setFilters] = useState({
    account: "",
    category: "",
    direction: "",
    search: ""
  })

  function onChange(key: string, value: any) {
    setForm(p => ({ ...p, [key]: value }))
  }

  function onFilterChange(key: string, value: string) {
    setFilters(p => ({ ...p, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {

    e.preventDefault()

    await createMut.mutateAsync({
      date: form.date,
      description: form.description || undefined,
      amount: Number(form.amount),
      direction: form.direction,
      account_id: form.account_id,
      category_id: form.category_id,
      payment_method: form.payment_method,
      merchant: form.merchant || undefined
    })

    setForm({
      date: new Date().toISOString().slice(0,10),
      description: "",
      amount: "",
      direction: "OUT",
      account_id: "",
      category_id: "",
      payment_method: "DEBIT",
      merchant: ""
    })

    if(window.innerWidth < 900){
      setFormOpen(false)
    }
  }

  async function onDelete(id: string) {

    if (!confirm("Eliminar transacción?")) return

    await deleteMut.mutateAsync(id)
  }

  const filteredTransactions = transactions.filter((t:any) => {

    if (filters.account && t.account_id !== filters.account) return false
    if (filters.category && t.category_id !== filters.category) return false
    if (filters.direction && t.direction !== filters.direction) return false

    if (filters.search) {

      const text =
        `${t.merchant ?? ""} ${t.description ?? ""} ${t.category_name ?? ""}`
        .toLowerCase()

      if (!text.includes(filters.search.toLowerCase())) return false
    }

    return true
  })

  return (

    <div className={styles.page}>

      <button
  type="button"
  className={styles.mobileToggle}
  onClick={() => setFormOpen(prev => !prev)}
>
  {formOpen ? "Ocultar formulario" : "Nueva transacción"}
</button> 

      <div className={styles.grid}>

        <Card className={`${styles.formCard} ${!formOpen ? styles.closed : ""}`}>

          <form onSubmit={onSubmit} className={styles.form}>

            <h2>Nueva transacción</h2>

            <select
              value={form.account_id}
              onChange={(e)=>onChange("account_id", e.target.value)}
              required
            >
              <option value="">Seleccionar cuenta</option>

              {accounts.map((a:any)=>(
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <select
              value={form.category_id}
              onChange={(e)=>onChange("category_id", e.target.value)}
              required
            >
              <option value="">Categoría</option>

              {categories.map((c:any)=>(
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={form.direction}
              onChange={(e)=>onChange("direction", e.target.value)}
            >
              <option value="OUT">Gasto</option>
              <option value="IN">Ingreso</option>
            </select>

            <select
              value={form.payment_method}
              onChange={(e)=>onChange("payment_method", e.target.value)}
            >
              <option value="DEBIT">Débito</option>
              <option value="CREDIT">Crédito</option>
              <option value="CASH">Efectivo</option>
              <option value="TRANSFER">Transferencia</option>
            </select>

            <input
              type="number"
              placeholder="Monto"
              value={form.amount}
              onChange={(e)=>onChange("amount", e.target.value)}
              required
            />

            <input
              placeholder="Comercio"
              value={form.merchant}
              onChange={(e)=>onChange("merchant", e.target.value)}
            />

            <input
              placeholder="Descripción"
              value={form.description}
              onChange={(e)=>onChange("description", e.target.value)}
            />

            <input
              type="date"
              value={form.date}
              onChange={(e)=>onChange("date", e.target.value)}
            />

            <Button type="submit">
              Crear
            </Button>

          </form>

        </Card>


        <div>

          <div className={styles.filters}>

            <select
              value={filters.account}
              onChange={(e)=>onFilterChange("account", e.target.value)}
            >
              <option value="">Todas las cuentas</option>

              {accounts.map((a:any)=>(
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e)=>onFilterChange("category", e.target.value)}
            >
              <option value="">Todas las categorías</option>

              {categories.map((c:any)=>(
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={filters.direction}
              onChange={(e)=>onFilterChange("direction", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="OUT">Gastos</option>
              <option value="IN">Ingresos</option>
            </select>

            <input
              placeholder="Buscar..."
              value={filters.search}
              onChange={(e)=>onFilterChange("search", e.target.value)}
            />

          </div>

          <div className={styles.list}>

            <div className={styles.tableHeader}>
              <span>Fecha</span>
              <span>Descripción</span>
              <span>Cuenta</span>
              <span>Categoría</span>
              <span>Monto</span>
              <span></span>
            </div>

            {filteredTransactions.map((t:any)=>(

              <div key={t.id} className={styles.row}>

                <span>{new Date(t.date).toLocaleDateString()}</span>

                <span>{t.merchant || t.description || "Movimiento"}</span>

                <span>{t.account_name}</span>

                <span>{t.category_name}</span>

                <span
                  className={
                    t.direction === "OUT"
                      ? styles.amountNegative
                      : styles.amountPositive
                  }
                >
                  {t.direction === "OUT" ? "-" : "+"}${t.amount}
                </span>

                <button
                  className={styles.delete}
                  onClick={()=>onDelete(t.id)}
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