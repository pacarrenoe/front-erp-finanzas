import { Outlet } from "react-router-dom"

import Sidebar from "../../components/layout/Sidebar/Sidebar"
import Header from "../../components/layout/Header/Header"

import styles from "./AppLayout.module.css"

export default function AppLayout() {

  return (

    <div className={styles.container}>

      <Sidebar />

      <div className={styles.content}>

        <Header />

        <main className={styles.main}>

          <Outlet />

        </main>

      </div>

    </div>

  )

}