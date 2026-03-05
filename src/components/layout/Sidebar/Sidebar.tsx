import styles from "./Sidebar.module.css"
import { NavLink } from "react-router-dom"

type Props = {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: Props) {

  return (

    <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>

      <div className={styles.logo}>
        ERP Finanzas
      </div>

      <nav className={styles.nav}>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
          onClick={onClose}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
          onClick={onClose}
        >
          Transacciones
        </NavLink>

        <NavLink
          to="/accounts"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
          onClick={onClose}
        >
          Cuentas
        </NavLink>

        <NavLink
          to="/debts"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
          onClick={onClose}
        >
          Deudas
        </NavLink>

        <NavLink
          to="/projection"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
          onClick={onClose}
        >
          Proyección
        </NavLink>

      </nav>

    </aside>

  )

}