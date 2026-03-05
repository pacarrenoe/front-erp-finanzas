import styles from "./Button.module.css"

type Props = {
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  variant?: "primary" | "secondary"
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary"
}: Props) {

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  )
}