import StatCard from "../../components/ui/StatCard/StatCard"
import Loader from "../../components/ui/Loader/Loader"
import Card from "../../components/ui/Card/Card"

import FinanceBarChart from "../../components/charts/FinanceBarChart"
import CategoryPieChart from "../../components/charts/CategoryPieChart"

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
        Aun no hay nada para mostrar en el dashboard. Registra algunas transacciones para verlo lleno de vida.
      </div>
    )
  }



  const income = dashboard.income_total || 0
  const commitments = dashboard.commitments_total || 0
  const expenses = dashboard.expense_total || 0



  const commitmentRatio =
    income > 0 ? commitments / income : 0



  const expenseRatio =
    income > 0 ? expenses / income : 0



  const runwayDays =
    expenses > 0
      ? Math.floor(
          dashboard.financial_health.cash_available / expenses
        )
      : 0



  return (

    <div className={styles.page}>


      {/* HEADER */}

      <div className={styles.header}>

        <div>

          <h1>Dashboard</h1>

          <p>
            Periodo {formatDate(dashboard.period.start_date)} → {formatDate(dashboard.period.end_date)}
          </p>

        </div>

        <span className={`${styles.badge} ${riskClass(dashboard.risk_level)}`}>
          Riesgo {dashboard.risk_level}
        </span>

      </div>



      {/* KPIs */}

      <div className={styles.grid}>

        <StatCard
          title="Ingreso período"
          value={formatMoney(income)}
        />

        <StatCard
          title="Compromisos"
          value={formatMoney(commitments)}
        />

        <StatCard
          title="Gasto real"
          value={formatMoney(expenses)}
          color="red"
        />

        <StatCard
          title="Saldo proyectado"
          value={formatMoney(dashboard.projected_available)}
          color="green"
        />

        <StatCard
          title="Dinero disponible"
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



      {/* SALUD FINANCIERA */}

      <div className={styles.healthGrid}>

        <Card>

          <div className={styles.progressCard}>

            <strong>Ratio compromisos</strong>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min(commitmentRatio * 100, 100)}%` }}
              />
            </div>

            <span>
              {Math.round(commitmentRatio * 100)}%
            </span>

          </div>

        </Card>



        <Card>

          <div className={styles.progressCard}>

            <strong>Ratio gasto</strong>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min(expenseRatio * 100, 100)}%` }}
              />
            </div>

            <span>
              {Math.round(expenseRatio * 100)}%
            </span>

          </div>

        </Card>



        <Card>

          <div className={styles.progressCard}>

            <strong>Dinero disponible</strong>

            <strong>{runwayDays} días</strong>

            <span>
              Dinero disponible si no ingresara nada más
            </span>

          </div>

        </Card>

      </div>



      {/* GRAFICOS */}

      <div className={styles.twoCols}>

        <Card>

          <h3>Ingresos vs gastos</h3>

          <FinanceBarChart
            income={income}
            expense={expenses}
            commitments={commitments}
          />

        </Card>



        <Card>

          <h3>Distribución de gastos</h3>

          {dashboard.breakdown_category?.length === 0 ? (

            <p className={styles.empty}>
              No hay gastos registrados
            </p>

          ) : (

            <CategoryPieChart
              data={dashboard.breakdown_category}
            />

          )}

        </Card>

      </div>



      {/* DESGLOSE */}

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



      {/* ACTIVIDAD */}

      <div className={styles.tripleCols}>

        <Card>

          <h3>Alertas</h3>

          {dashboard.alerts?.length === 0 && (
            <p className={styles.empty}>
              Sin alertas
            </p>
          )}

          {dashboard.alerts?.map((a: any) => (

            <div key={a.type} className={styles.alert}>
              {a.message}
            </div>

          ))}

        </Card>



        <Card>

          <h3>Top categorías</h3>

          {dashboard.breakdown_category?.length === 0 && (
            <p className={styles.empty}>
              Sin gastos
            </p>
          )}

          {dashboard.breakdown_category?.slice(0, 5).map((c: any) => (

            <div key={c.category_id} className={styles.listRow}>

              <span>{c.category_name}</span>

              <strong>{formatMoney(c.total)}</strong>

            </div>

          ))}

        </Card>



        <Card>

          <h3>Movimiento cuentas</h3>

          {dashboard.breakdown_account?.length === 0 && (
            <p className={styles.empty}>
              Sin movimientos
            </p>
          )}

          {dashboard.breakdown_account?.slice(0, 5).map((a: any) => (

            <div key={a.account_id} className={styles.listRow}>

              <span>{a.account_name}</span>

              <strong>{formatMoney(a.total)}</strong>

            </div>

          ))}

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