import { NavLink } from "react-router-dom"
import styles from "./Sidebar.module.css"

export default function Sidebar() {

  return (

    <aside className={styles.sidebar}>

      <h2 className={styles.logo}>
        ERP Finanzas
      </h2>

      <nav>

        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link }>
          Dashboard
        </NavLink>

        <NavLink to="/transactions" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link }>
          Transacciones
        </NavLink>

        <NavLink to="/accounts" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link }>
          Cuentas
        </NavLink>

        <NavLink to="/debts" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link }>
          Deudas
        </NavLink>

        <NavLink to="/projection" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link }>
          Proyección
        </NavLink>

      </nav>

    </aside>

  )

}