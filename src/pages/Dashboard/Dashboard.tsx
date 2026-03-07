import Card from "../../components/ui/Card/Card"
import styles from "./Dashboard.module.css"

import { useDashboard } from "../../features/dashboard/hooks/useDashboard"

export default function Dashboard(){

  const { income, expense, balance, accounts } = useDashboard()

  return(

  <div className={styles.page}>

    <div className={styles.grid}>

      <Card>

        <div className={styles.stat}>

          <span>Balance total</span>

          <strong>${balance}</strong>

        </div>

      </Card>

      <Card>

        <div className={styles.stat}>

          <span>Ingresos</span>

          <strong className={styles.income}>
            +${income}
          </strong>

        </div>

      </Card>

      <Card>

        <div className={styles.stat}>

          <span>Gastos</span>

          <strong className={styles.expense}>
            -${expense}
          </strong>

        </div>

      </Card>

    </div>


    <Card>

      <h2>Cuentas</h2>

      <div className={styles.accounts}>

      {accounts.map((a:any)=>(
        
        <div key={a.id} className={styles.account}>

          <span>{a.name}</span>

          <strong>${a.balance ?? 0}</strong>

        </div>

      ))}

      </div>

    </Card>

  </div>

  )

}