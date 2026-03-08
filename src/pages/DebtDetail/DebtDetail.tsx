import { useParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import { useDebtSchedule } from "../../features/debts/hooks/useDebtSchedule";
import { useScheduleMutations } from "../../features/debts/hooks/useScheduleMutations";
import { useAccounts } from "../../features/accounts/hooks/useAccounts";
import Loader from "../../components/ui/Loader/Loader"
import styles from "./DebtDetail.module.css";

export default function DebtDetail() {
  const { id } = useParams();

  const { data: schedule = [], isLoading } = useDebtSchedule(id as string);
  const { data: accounts = [] } = useAccounts();
  const { payMut } = useScheduleMutations();

  const [account, setAccount] = useState("");
  const [method, setMethod] = useState<
    "CASH" | "DEBIT" | "CREDIT" | "TRANSFER"
  >("DEBIT");

  async function pay(scheduleId: string) {
    if (!account) {
      toast.error("Selecciona una cuenta");
      return;
    }

    try {
      await payMut.mutateAsync({
        scheduleId,
        accountId: account,
        method,
      });

      toast.success("Cuota pagada");
    } catch {
      toast.error("Error pagando cuota");
    }
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Loader />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h2>Cuotas</h2>

      <div className={styles.paymentBar}>
        <select value={account} onChange={(e) => setAccount(e.target.value)}>
          <option value="">Cuenta</option>

          {accounts.map((a: any) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          value={method}
          onChange={(e) =>
            setMethod(
              e.target.value as "CASH" | "DEBIT" | "CREDIT" | "TRANSFER"
            )
          }
        >
          <option value="DEBIT">Débito</option>
          <option value="CREDIT">Crédito</option>
          <option value="CASH">Efectivo</option>
          <option value="TRANSFER">Transferencia</option>
        </select>
      </div>

      <div className={styles.list}>
        <div className={styles.tableHeader}>
          <span>Fecha</span>
          <span>Monto</span>
          <span>Estado</span>
          <span></span>
        </div>

        {schedule.map((s: any) => (
          <div key={s.id} className={styles.row}>
            <span>{new Date(s.due_date).toLocaleDateString()}</span>

            <span>${Number(s.amount).toLocaleString()}</span>

            <span
              className={s.status === "PAID" ? styles.paid : styles.pending}
            >
              {s.status === "PAID" ? "Pagado" : "Pendiente"}
            </span>

            {s.status !== "PAID" ? (
              <button
                type="button"
                className={styles.pay}
                onClick={() => pay(s.id)}
              >
                Pagar
              </button>
            ) : (
              <span className={styles.done}>Registrado</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}