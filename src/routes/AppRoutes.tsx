import { Routes, Route, Navigate } from "react-router-dom"

import Login from "../pages/Login/Login"
import Dashboard from "../pages/Dashboard/Dashboard"
import Accounts from "../pages/Accounts/Accounts"
import Transactions from "../pages/Transactions/Transactions"
import Debts from "../pages/Debts/Debts"
import DebtDetail from "../pages/DebtDetail/DebtDetail";


import AppLayout from "../layouts/AppLayout/AppLayout"
import ProtectedRoute from "./ProtectedRoute"

export default function AppRoutes() {

  return (

    <Routes>

      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >

        <Route path="/" element={<Dashboard />}/>
        <Route path="/accounts"  element={<Accounts />}/>
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/debts" element={<Debts />} />  
        <Route path="/debts/:id" element={<DebtDetail/>}/> 

      </Route>

      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>

  )

}