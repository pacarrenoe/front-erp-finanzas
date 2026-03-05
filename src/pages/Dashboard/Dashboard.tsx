import { useDashboard } from "../../features/dashboard/hooks/useDashboard"
import Card from "../../components/ui/Card/Card"
import styles from "./Dashboard.module.css"

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboard()

  if (isLoading) {
    return <p>Cargando dashboard...</p>
  }

  if (isError) {
    return <p>No se pudo cargar información.</p>
  }

  // fallback seguro por si backend devuelve null/undefined
  const income = data?.income ?? 0
  const commitments = data?.commitments ?? 0
  const expenses = data?.expenses ?? 0
  const balance = data?.balance ?? 0

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>

      <div className={styles.grid}>
        <Card>
          <p>Ingreso período</p>
          <h2>${income}</h2>
        </Card>

        <Card>
          <p>Compromisos</p>
          <h2>${commitments}</h2>
        </Card>

        <Card>
          <p>Gasto real</p>
          <h2>${expenses}</h2>
        </Card>

        <Card>
          <p>Saldo proyectado</p>
          <h2>${balance}</h2>
        </Card>
      </div>
    </div>
  )
}