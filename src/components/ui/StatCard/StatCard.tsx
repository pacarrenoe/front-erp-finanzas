import styles from "./StatCard.module.css"

type Props = {
  title: string
  value: string
}

export default function StatCard({ title, value }: Props) {

  return (

    <div className={styles.card}>

      <span className={styles.title}>
        {title}
      </span>

      <span className={styles.value}>
        {value}
      </span>

    </div>

  )

}