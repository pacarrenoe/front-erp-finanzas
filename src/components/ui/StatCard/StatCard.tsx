import Card from "../Card/Card"
import styles from "./StatCard.module.css"

type Props = {

  title:string
  value:string | number
  color?: "green" | "red" | "default"
  subtitle?:string

}

export default function StatCard({
  title,
  value,
  color="default",
  subtitle
}:Props){

  return(

    <Card>

      <div className={styles.stat}>

        <span className={styles.title}>
          {title}
        </span>

        <strong
        className={
          color === "green"
          ? styles.green
          : color === "red"
          ? styles.red
          : styles.value
        }
        >
          {value}
        </strong>

        {subtitle && (

          <small className={styles.subtitle}>
            {subtitle}
          </small>

        )}

      </div>

    </Card>

  )

}