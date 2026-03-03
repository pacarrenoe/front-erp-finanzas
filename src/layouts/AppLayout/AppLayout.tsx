import { Outlet } from "react-router-dom";
import styles from "./AppLayout.module.css";
import { SidebarNav } from "./SidebarNav";

export function AppLayout() {
  return (
    <div className={styles.shell}>
      {/* Skip link: aparece al tabear */}
      <a className={styles.skipLink} href="#main">
        Saltar al contenido principal
      </a>

      <aside className={styles.sidebar} aria-label="Navegación principal">
        <div className={styles.brand} aria-label="ERP Finanzas Personal">
          ERP Finanzas
        </div>
        <SidebarNav />
      </aside>

      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Finanzas</h1>
          {/* Aquí después pondremos selector de período, quick-add, etc. */}
        </header>

        <main id="main" className={styles.main} tabIndex={-1}>
          <Outlet />
        </main>

        <footer className={styles.footer}>Local • WiFi • Gratis</footer>
      </div>
    </div>
  );
}