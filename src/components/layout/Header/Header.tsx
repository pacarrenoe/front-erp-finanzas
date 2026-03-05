import styles from "./Header.module.css"
import { useAuth } from "../../../context/AuthContext"

export default function Header() {

  const { logout } = useAuth()

  const email = localStorage.getItem("userEmail")

  return (

    <header className={styles.header}>

      <div className={styles.title}>
        Panel financiero
      </div>

      <div className={styles.userSection}>

        <span>
          {email}
        </span>

        <button
          className={styles.logout}
          onClick={logout}
        >
          Cerrar sesión
        </button>

      </div>

    </header>

  )

}