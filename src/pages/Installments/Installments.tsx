import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";

import { usePeriods } from "../../features/periods/hooks/usePeriods";
import { useInstallments, useInstallmentMutations, useInstallmentsSummary } from "../../features/installment/hooks/useInstallments";

import styles from "./Installments.module.css";

export default function Installments() {
  const { data: periods = [] } = usePeriods();

  const defaultPeriodId = periods[0]?.id ?? "";

  const [filters, setFilters] = useState({
    periodId: defaultPeriodId,
    status: "" as "" | "PENDING" | "PAID",
    search: "",
  });

  const { data: installments = [] } = useInstallments({
    periodId: filters.periodId || undefined,
    status: filters.status,
  });

  const { data: summary } = useInstallmentsSummary(filters.periodId || undefined);
  const { payMut } = useInstallmentMutations();

  function onFilterChange(key: string, value: string) {
    setFilters((p) => ({ ...p, [key]: value }));
  }

  async function onMarkPaid(id: string) {
    try {
      await payMut.mutateAsync({
        id,
        payload: {},
      });

      toast.success("Cuota marcada como pagada");
    } catch (err: any) {
      const message =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Error marcando cuota";
      toast.error(message);
    }
  }

  const filtered = useMemo(() => {
    return installments.filter((i: any) => {
      if (filters.search) {
        const text = `${i.description ?? ""} ${i.card_name ?? ""}`.toLowerCase();
        if (!text.includes(filters.search.toLowerCase())) return false;
      }
      return true;
    });
  }, [installments, filters.search]);

  return (
    <div className={styles.page}>
      {summary && (
        <Card>
          <div className={styles.summary}>
            <div>
              <span>Pendiente período</span>
              <strong className={styles.amountNegative}>
                ${Number(summary.pending_total ?? 0).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Pagado período</span>
              <strong className={styles.amountPositive}>
                ${Number(summary.paid_total ?? 0).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Cuotas pendientes</span>
              <strong>{summary.pending_count ?? 0}</strong>
            </div>

            <div>
              <span>Cuotas pagadas</span>
              <strong>{summary.paid_count ?? 0}</strong>
            </div>
          </div>
        </Card>
      )}

      <div className={styles.filters}>
        <select
          value={filters.periodId}
          onChange={(e) => onFilterChange("periodId", e.target.value)}
        >
          <option value="">Todos los períodos</option>

          {periods.map((p: any) => (
            <option key={p.id} value={p.id}>
              {new Date(p.start_date).toLocaleDateString()} -{" "}
              {p.end_date ? new Date(p.end_date).toLocaleDateString() : "abierto"}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendientes</option>
          <option value="PAID">Pagadas</option>
        </select>

        <input
          placeholder="Buscar..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
      </div>

      <div className={styles.list}>
        <div className={styles.tableHeader}>
          <span>Fecha</span>
          <span>Tarjeta</span>
          <span>Descripción</span>
          <span>Monto</span>
          <span>Estado</span>
          <span></span>
        </div>

        {filtered.map((i: any) => (
          <div key={i.id} className={styles.row}>
            <span>{new Date(i.due_date).toLocaleDateString()}</span>

            <span>
              {i.card_name}
              {i.card_last4 ? ` ••••${i.card_last4}` : ""}
            </span>

            <span>{i.description || "Cuota"}</span>

            <span
              className={
                i.status === "PAID" ? styles.amountPositive : styles.amountNegative
              }
            >
              ${Number(i.amount).toLocaleString()}
            </span>

            <span className={i.status === "PAID" ? styles.badgePaid : styles.badgePending}>
              {i.status === "PAID" ? "Pagada" : "Pendiente"}
            </span>

            {i.status === "PENDING" ? (
              <Button type="button" onClick={() => onMarkPaid(i.id)}>
                Marcar pagada
              </Button>
            ) : (
              <span className={styles.done}>Registrada</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}