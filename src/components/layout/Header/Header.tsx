import styles from "./Header.module.css"
import { useAuth } from "../../../context/AuthContext"

type Props = {
  toggleSidebar: () => void
}

export default function Header({ toggleSidebar }: Props) {

  const { logout } = useAuth()

  const email = sessionStorage.getItem("userEmail")

  return (

    <header className={styles.header}>

      <button
        className={styles.menu}
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <div className={styles.title}>
      
      </div>

      <div className={styles.userSection}>

        <span className={styles.user}>
         Hola! {email}
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