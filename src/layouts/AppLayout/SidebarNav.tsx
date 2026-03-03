import { NavLink } from "react-router-dom";
import styles from "./SidebarNav.module.css";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.link} ${styles.active}` : styles.link;

export function SidebarNav() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" end className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/periods" className={linkClass}>
        Períodos
      </NavLink>
      <NavLink to="/transactions" className={linkClass}>
        Movimientos
      </NavLink>
      <NavLink to="/settings" className={linkClass}>
        Configuración
      </NavLink>
    </nav>
  );
}