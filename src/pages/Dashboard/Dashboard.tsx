import Card from "../../components/ui/Card/Card"
import styles from "./Dashboard.module.css"

export default function Dashboard() {

  return (

    <div>

      <h1>Dashboard</h1>

      <div className={styles.grid}>

        <Card>Saldo actual</Card>

        <Card>Ingresos</Card>

        <Card>Gastos</Card>

        <Card>Proyección</Card>

      </div>

    </div>

  )

}