import StatCard from "../../components/ui/StatCard/StatCard"
import Loader from "../../components/ui/Loader/Loader"
import Card from "../../components/ui/Card/Card"

import styles from "./Dashboard.module.css"

import {
  useDashboard,
  useDashboardTrend
} from "../../features/dashboard/hooks/useDashboard"

function formatMoney(value: number) {

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(value || 0)

}

function formatDate(value: string) {

  const date = new Date(value)

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date)

}

function riskClass(level: string) {

  switch (level) {

    case "BAJO":
      return styles.riskLow

    case "MEDIO":
      return styles.riskMedium

    case "ALTO":
      return styles.riskHigh

    case "CRITICO":
      return styles.riskCritical

    default:
      return ""

  }

}

export default function Dashboard() {

  const { data: dashboard, isLoading, error } = useDashboard()
  const { data: trend = [] } = useDashboardTrend(6)

  if (isLoading) {

    return (
      <div className={styles.page}>
        <Loader />
      </div>
    )

  }

  if (error || !dashboard) {

    return (
      <div className={styles.page}>
        Error cargando dashboard
      </div>
    )

  }

  return (

    <div className={styles.page}>

      {/* HEADER */}

      <div className={styles.header}>
        <div>
          <p>
            <p>
              Periodo {formatDate(dashboard.period.start_date)} al {formatDate(dashboard.period.end_date)}
            </p>
          </p>
        </div>

        <div className={styles.badgeBox}>
          <span className={`${styles.badge} ${riskClass(dashboard.risk_level)}`}>
            Riesgo {dashboard.risk_level}
          </span>
        </div>

      </div>



      {/* KPI PRINCIPALES */}

      <div className={styles.grid}>

        <StatCard
          title="Ingreso período"
          value={formatMoney(dashboard.income_total)}
        />

        <StatCard
          title="Compromisos"
          value={formatMoney(dashboard.commitments_total)}
        />

        <StatCard
          title="Gasto real"
          value={formatMoney(dashboard.expense_total)}
          color="red"
        />

        <StatCard
          title="Saldo proyectado"
          value={formatMoney(dashboard.projected_available)}
          color="green"
        />

        <StatCard
          title="Cash disponible"
          value={formatMoney(dashboard.financial_health.cash_available)}
          color="green"
        />

        <StatCard
          title="Fondo comida"
          value={formatMoney(dashboard.financial_health.food_fund)}
        />

        <StatCard
          title="Días hasta sueldo"
          value={dashboard.financial_health.days_until_salary}
        />

        <StatCard
          title="Presupuesto diario"
          value={formatMoney(dashboard.financial_health.daily_budget)}
          color="green"
        />

      </div>



      {/* DESGLOSES */}

      <div className={styles.twoCols}>

        <Card>

          <h3>Desglose de ingresos</h3>

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

          <h3>Desglose de compromisos</h3>

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

      {/* CATEGORIAS + CUENTAS + ALERTAS*/}

      <div className={styles.twoCols}>
        <Card>

        <h3>Alertas</h3>

        <div className={styles.alerts}>

          {dashboard.alerts.length === 0 && (
            <span className={styles.empty}>Sin alertas en este período</span>
          )}

          {dashboard.alerts.map((a: any) => (

            <div key={a.type} className={styles.alert}>

              <strong>{a.type}</strong>

              <p>{a.message}</p>

            </div>

          ))}

        </div>

      </Card>

        <Card>

          <h3>Top categorías de gasto</h3>

          <div className={styles.list}>

            {dashboard.breakdown_category.length === 0 && (
              <span className={styles.empty}>No hay gastos registrados</span>
            )}

            {dashboard.breakdown_category.map((c: any) => (

              <div key={c.category_id} className={styles.listRow}>

                <span>{c.category_name}</span>

                <strong>{formatMoney(c.total)}</strong>

              </div>

            ))}

          </div>

        </Card>



        <Card>

          <h3>Movimiento por cuenta</h3>

          <div className={styles.accountTable}>

            {dashboard.breakdown_account.length === 0 && (
              <span className={styles.empty}>No hay movimiento por cuenta</span>
            )}

            {dashboard.breakdown_account.map((a: any) => (

              <div key={a.account_id} className={styles.accountRow}>

                <div>

                  <div className={styles.accountName}>{a.account_name}</div>

                  <div className={styles.accountType}>{a.account_type}</div>

                </div>

                <div className={styles.accountTotals}>

                  <span>{formatMoney(a.total)}</span>

                </div>

              </div>

            ))}

          </div>

        </Card>

      </div>



      {/* TENDENCIA */}

      <Card>

        <h3>Tendencia últimos períodos</h3>

        <div className={styles.trendTable}>

          <div className={`${styles.trendRow} ${styles.trendHead}`}>

            <span>Periodo</span>
            <span>Ingreso</span>
            <span>Gasto</span>
            <span>Base</span>
            <span>Pluxee</span>

          </div>

          {trend.map((p: any) => (

            <div key={p.period_id} className={styles.trendRow}>

              <span>{p.period}</span>
              <span>{formatMoney(p.income_total)}</span>
              <span>{formatMoney(p.expense_total)}</span>
              <span>{formatMoney(p.base_salary)}</span>
              <span>{formatMoney(p.pluxee)}</span>

            </div>

          ))}

        </div>

      </Card>

    </div>

  )

}