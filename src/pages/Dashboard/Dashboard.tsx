import Card from "../../components/ui/Card/Card";
import styles from "./Dashboard.module.css";
import {
  useDashboard,
  useDashboardTrend,
} from "../../features/dashboard/hooks/useDashboard";

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function riskClass(level: string) {
  switch (level) {
    case "BAJO":
      return styles.riskLow;
    case "MEDIO":
      return styles.riskMedium;
    case "ALTO":
      return styles.riskHigh;
    case "CRITICO":
      return styles.riskCritical;
    default:
      return "";
  }
}

export default function Dashboard() {
  const {
    data: dashboard,
    isLoading,
    isError,
    error,
  } = useDashboard();

  const {
    data: trend = [],
    isLoading: trendLoading,
  } = useDashboardTrend(6);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Card>
          <div className={styles.empty}>Cargando dashboard...</div>
        </Card>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className={styles.page}>
        <Card>
          <div className={styles.empty}>
            {(error as Error)?.message || "No se pudo cargar el dashboard"}
          </div>
        </Card>
      </div>
    );
  }

  const expenseCategories = (dashboard.breakdown_category || []).filter(
    (item: any) => item.kind === "EXPENSE"
  );

  const incomeCategories = (dashboard.breakdown_category || []).filter(
    (item: any) => item.kind === "INCOME"
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p>
            Período: {dashboard.period.start_date} →{" "}
            {dashboard.period.end_date ?? "abierto"}
          </p>
        </div>

        <div className={styles.badgeBox}>
          <span className={`${styles.badge} ${riskClass(dashboard.risk_level)}`}>
            Riesgo {dashboard.risk_level}
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        <Card>
          <div className={styles.stat}>
            <span>Ingreso del período</span>
            <strong>{formatMoney(dashboard.income_total)}</strong>
            <small>
              Sueldo + Pluxee + ingresos extra + cobros de deuda
            </small>
          </div>
        </Card>

        <Card>
          <div className={styles.stat}>
            <span>Compromisos</span>
            <strong>{formatMoney(dashboard.commitments_total)}</strong>
            <small>
              Recurrentes + cuotas + pagos de deuda
            </small>
          </div>
        </Card>

        <Card>
          <div className={styles.stat}>
            <span>Gasto real</span>
            <strong className={styles.expense}>
              {formatMoney(dashboard.expense_total)}
            </strong>
            <small>Transacciones OUT del período</small>
          </div>
        </Card>

        <Card>
          <div className={styles.stat}>
            <span>Saldo proyectado</span>
            <strong
              className={
                dashboard.projected_available >= 0
                  ? styles.income
                  : styles.expense
              }
            >
              {formatMoney(dashboard.projected_available)}
            </strong>
            <small>
              Ingreso - compromisos - gasto real
            </small>
          </div>
        </Card>

        <Card>
          <div className={styles.stat}>
            <span>Ratio de compromiso</span>
            <strong>{dashboard.commitment_ratio_pct}%</strong>
            <small>Compromisos / ingreso</small>
          </div>
        </Card>

        <Card>
          <div className={styles.stat}>
            <span>Ratio servicio deuda</span>
            <strong>{dashboard.debt_service_ratio_pct}%</strong>
            <small>Cuotas / ingreso</small>
          </div>
        </Card>
      </div>

      <div className={styles.twoCols}>
        <Card>
          <h2>Desglose de ingresos</h2>

          <div className={styles.kpiList}>
            <div className={styles.kpiRow}>
              <span>Sueldo base</span>
              <strong>{formatMoney(dashboard.income_breakdown.salary)}</strong>
            </div>
            <div className={styles.kpiRow}>
              <span>Pluxee</span>
              <strong>{formatMoney(dashboard.income_breakdown.pluxee)}</strong>
            </div>
            <div className={styles.kpiRow}>
              <span>Ingresos extra</span>
              <strong>{formatMoney(dashboard.income_breakdown.extra_income)}</strong>
            </div>
            <div className={styles.kpiRow}>
              <span>Cobros de deudas</span>
              <strong>{formatMoney(dashboard.income_breakdown.debt_collections)}</strong>
            </div>
          </div>
        </Card>

        <Card>
          <h2>Desglose de compromisos</h2>

          <div className={styles.kpiList}>
            <div className={styles.kpiRow}>
              <span>Recurrentes</span>
              <strong>{formatMoney(dashboard.commitments_breakdown.recurring)}</strong>
            </div>
            <div className={styles.kpiRow}>
              <span>Cuotas</span>
              <strong>{formatMoney(dashboard.commitments_breakdown.installments)}</strong>
            </div>
            <div className={styles.kpiRow}>
              <span>Pagos de deudas</span>
              <strong>{formatMoney(dashboard.commitments_breakdown.debt_payments)}</strong>
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.twoCols}>
        <Card>
          <h2>Alertas</h2>

          {dashboard.alerts?.length === 0 ? (
            <div className={styles.empty}>Sin alertas en este período</div>
          ) : (
            <div className={styles.alerts}>
              {dashboard.alerts.map((alert: any, index: number) => (
                <div key={index} className={styles.alert}>
                  <strong>{alert.type}</strong>

                  {alert.category && (
                    <p>
                      Categoría: {alert.category}
                    </p>
                  )}

                  {alert.message && (
                    <p>{alert.message}</p>
                  )}

                  {typeof alert.spent === "number" && typeof alert.limit === "number" && (
                    <p>
                      Gastado: {formatMoney(alert.spent)} / Límite: {formatMoney(alert.limit)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2>Top categorías de gasto</h2>

          {expenseCategories.length === 0 ? (
            <div className={styles.empty}>No hay gastos registrados</div>
          ) : (
            <div className={styles.list}>
              {expenseCategories.slice(0, 8).map((item: any) => (
                <div key={`${item.kind}-${item.name}`} className={styles.listRow}>
                  <span>{item.name}</span>
                  <strong>{formatMoney(item.total)}</strong>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className={styles.twoCols}>
        <Card>
          <h2>Ingresos por categoría</h2>

          {incomeCategories.length === 0 ? (
            <div className={styles.empty}>No hay ingresos extra registrados</div>
          ) : (
            <div className={styles.list}>
              {incomeCategories.map((item: any) => (
                <div key={`${item.kind}-${item.name}`} className={styles.listRow}>
                  <span>{item.name}</span>
                  <strong>{formatMoney(item.total)}</strong>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2>Movimiento por cuenta</h2>

          {dashboard.breakdown_account?.length === 0 ? (
            <div className={styles.empty}>No hay movimiento por cuenta</div>
          ) : (
            <div className={styles.accountTable}>
              {dashboard.breakdown_account.map((item: any, index: number) => (
                <div key={`${item.name}-${index}`} className={styles.accountRow}>
                  <div>
                    <div className={styles.accountName}>{item.name}</div>
                    <div className={styles.accountType}>{item.type}</div>
                  </div>

                  <div className={styles.accountTotals}>
                    <span className={styles.income}>
                      + {formatMoney(item.in_total)}
                    </span>
                    <span className={styles.expense}>
                      - {formatMoney(item.out_total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h2>Tendencia últimos períodos</h2>

        {trendLoading ? (
          <div className={styles.empty}>Cargando tendencia...</div>
        ) : trend.length === 0 ? (
          <div className={styles.empty}>No hay períodos suficientes</div>
        ) : (
          <div className={styles.trendTable}>
            <div className={`${styles.trendRow} ${styles.trendHead}`}>
              <span>Período</span>
              <span>Ingreso</span>
              <span>Gasto</span>
              <span>Base</span>
              <span>Pluxee</span>
            </div>

            {trend.map((item: any) => {
              const incomeTotal =
                Number(item.base_salary_amount || 0) +
                Number(item.pluxee_amount || 0) +
                Number(item.tx_income_total || 0);

              return (
                <div key={item.id} className={styles.trendRow}>
                  <span>
                    {item.start_date} → {item.end_date ?? "abierto"}
                  </span>
                  <span>{formatMoney(incomeTotal)}</span>
                  <span>{formatMoney(item.tx_expense_total)}</span>
                  <span>{formatMoney(item.base_salary_amount)}</span>
                  <span>{formatMoney(item.pluxee_amount)}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}