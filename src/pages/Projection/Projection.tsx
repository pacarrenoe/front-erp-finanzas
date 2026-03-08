import { useProjection } from "../../features/projection/hooks/useProjection"

import Card from "../../components/ui/Card/Card"

import styles from "./Projection.module.css"

export default function Projection(){

  const { data: projection = [] } =
    useProjection(6)

  return(

    <div className={styles.page}>

      <Card>

        <div className={styles.list}>

          <div className={styles.tableHeader}>
            <span>Periodo</span>
            <span>Ingreso</span>
            <span>Compromisos</span>
            <span>Saldo</span>
            <span>Riesgo</span>
          </div>

          {projection.map((p:any)=>(

            <div key={p.index} className={styles.row}>

              <span>{p.start_date}</span>

              <span>${p.income_expected}</span>

              <span>${p.commitments_expected}</span>

              <span>${p.projected_available}</span>

              <span className={styles[p.risk_level]}>
                {p.risk_level}
              </span>

            </div>

          ))}

        </div>

      </Card>

    </div>
  )

}