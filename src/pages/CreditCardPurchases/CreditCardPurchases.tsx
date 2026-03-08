import { useState } from "react"
import { usePurchases } from "../../features/credit-card-purchases/hooks/usePurchases"
import { useAccounts } from "../../features/accounts/hooks/useAccounts"

import Card from "../../components/ui/Card/Card"
import Button from "../../components/ui/Button/Button"

import toast from "react-hot-toast"

import styles from "./CreditCardPurchases.module.css"

export default function CreditCardPurchases() {

    const { data: purchases = [], summary, createMut, deleteMut } = usePurchases()

    const { data: accounts = [] } = useAccounts()

    const creditCards = accounts.filter((a: any) => a.type === "CREDIT_CARD")

    const [formOpen, setFormOpen] = useState(true)

    const [form, setForm] = useState({

        card_account_id: "",
        total_amount: "",
        installments: "",
        first_installment_date: new Date().toISOString().slice(0, 10),
        description: ""

    })

    const [filters, setFilters] = useState({

        card: "",
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

        try {

            await createMut.mutateAsync({

                card_account_id: form.card_account_id,
                total_amount: Number(form.total_amount),
                installments: Number(form.installments),
                first_installment_date: form.first_installment_date,
                description: form.description || undefined

            })

            toast.success("Compra creada")

            setForm({

                card_account_id: "",
                total_amount: "",
                installments: "",
                first_installment_date: new Date().toISOString().slice(0, 10),
                description: ""

            })

            if (window.innerWidth < 900) {

                setFormOpen(false)

            }

        } catch (err: any) {

            const message =
                err?.response?.data?.error?.message ||
                err?.message ||
                "Error creando compra"

            toast.error(message)

        }

    }

    async function onDelete(id: string) {

        try {

            await deleteMut.mutateAsync(id)

            toast.success("Compra eliminada")

        } catch (err: any) {

            const message =
                err?.response?.data?.error?.message ||
                err?.message ||
                "Error eliminando compra"

            toast.error(message)

        }

    }

    const filtered = purchases.filter((p: any) => {

        if (filters.card && p.card_account_id !== filters.card) return false

        if (filters.search) {

            const text = `${p.description ?? ""} ${p.card_name ?? ""}`.toLowerCase()

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

                {formOpen ? "Ocultar formulario" : "Nueva compra"}

            </button>

            {/* SUMMARY TARJETAS */}

            {summary?.data && (

                <Card>

                    <div className={styles.summary}>

                        <div>

                            <span>Deuda pendiente</span>

                            <strong>${summary.data.pending_amount ?? 0}</strong>

                        </div>

                        <div>

                            <span>Pagado</span>

                            <strong>${summary.data.paid_amount ?? 0}</strong>

                        </div>

                        <div>

                            <span>Cuotas pendientes</span>

                            <strong>{summary.data.pending_installments ?? 0}</strong>

                        </div>

                    </div>

                </Card>

            )}

            <div className={styles.grid}>

                <Card className={`${styles.formCard} ${!formOpen ? styles.closed : ""}`}>

                    <form onSubmit={onSubmit} className={styles.form}>

                        <h2>Nueva compra en cuotas</h2>

                        <select
                            value={form.card_account_id}
                            onChange={(e) => onChange("card_account_id", e.target.value)}
                            required
                        >

                            <option value="">Seleccionar tarjeta</option>

                            {creditCards.map((a: any) => (

                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>

                            ))}

                        </select>

                        <input
                            type="number"
                            placeholder="Monto total"
                            value={form.total_amount}
                            onChange={(e) => onChange("total_amount", e.target.value)}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Número de cuotas"
                            value={form.installments}
                            onChange={(e) => onChange("installments", e.target.value)}
                            required
                        />

                        <input
                            type="date"
                            value={form.first_installment_date}
                            onChange={(e) => onChange("first_installment_date", e.target.value)}
                        />

                        <input
                            placeholder="Descripción"
                            value={form.description}
                            onChange={(e) => onChange("description", e.target.value)}
                        />

                        <Button type="submit">

                            Crear compra

                        </Button>

                    </form>

                </Card>

                <div>

                    <div className={styles.filters}>

                        <select
                            value={filters.card}
                            onChange={(e) => onFilterChange("card", e.target.value)}
                        >

                            <option value="">Todas las tarjetas</option>

                            {creditCards.map((a: any) => (

                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>

                            ))}

                        </select>

                        <input
                            placeholder="Buscar..."
                            value={filters.search}
                            onChange={(e) => onFilterChange("search", e.target.value)}
                        />

                    </div>

                    <div className={styles.list}>

                        <div className={styles.tableHeader}>

                            <span>Tarjeta</span>
                            <span>Descripción</span>
                            <span>Total</span>
                            <span>Progreso</span>
                            <span>Estado</span>
                            <span></span>

                        </div>

                        {filtered.map((p: any) => (

                            <div key={p.id} className={styles.row}>

                                <span>

                                    {p.card_name} ••••{p.card_last4}

                                </span>

                                <span>

                                    {p.description || "Compra"}

                                </span>

                                <span>

                                    ${p.total_amount}

                                </span>

                                <div className={styles.progressContainer}>

                                    <div className={styles.progressBar}>

                                        <div
                                            className={styles.progressFill}
                                            style={{
                                                width: `${(p.paid_installments / p.total_installments) * 100}%`
                                            }}
                                        />

                                    </div>

                                    <span className={styles.progressText}>

                                        {p.paid_installments}/{p.total_installments}

                                    </span>

                                </div>

                                <span>

                                    {p.status}

                                </span>

                                <button
                                    className={styles.delete}
                                    onClick={() => onDelete(p.id)}
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