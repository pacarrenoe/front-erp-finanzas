import styles from "./Button.module.css"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger"
}

export default function Button({ variant = "primary", className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`${styles.btn} ${styles[variant]} ${className}`}
    />
  )
}