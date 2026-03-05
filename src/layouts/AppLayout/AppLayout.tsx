import { useState } from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "../../components/layout/Sidebar/Sidebar"
import Header from "../../components/layout/Header/Header"

import styles from "./AppLayout.module.css"

export default function AppLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false)

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (

    <div className={styles.layout}>

      <Sidebar
        open={sidebarOpen}
        onClose={closeSidebar}
      />

      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={closeSidebar}
        />
      )}

      <div className={styles.content}>

        <Header
          toggleSidebar={() =>
            setSidebarOpen(!sidebarOpen)
          }
        />

        <main className={styles.main}>
          <Outlet />
        </main>

      </div>

    </div>

  )

}