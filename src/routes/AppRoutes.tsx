import { Routes, Route, Navigate } from "react-router-dom"

import Login from "../pages/Login/Login"
import Register from "../pages/Register/Register"
import Dashboard from "../pages/Dashboard/Dashboard"
import Accounts from "../pages/Accounts/Accounts"
import Transactions from "../pages/Transactions/Transactions"
import Debts from "../pages/Debts/Debts"
import DebtDetail from "../pages/DebtDetail/DebtDetail";
import Recurring from "../pages/Recurring/Recurring";
import CreditCardPurchases from "../pages/CreditCardPurchases/CreditCardPurchases"
import Installments from "../pages/Installments/Installments"
import Periods from "../pages/Periods/Periods"
import Categories from "../pages/Categories/Categories"
import Budget from "../pages/Budget/Budget"
import Projection from "../pages/Projection/Projection"


import AppLayout from "../layouts/AppLayout/AppLayout"
import ProtectedRoute from "./ProtectedRoute"

export default function AppRoutes() {

  return (

    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >

        <Route path="/" element={<Dashboard />} />

        
        <Route path="/periods" element={<Periods />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/installments" element={<Installments />} />
        <Route path="/credit-card-purchases" element={<CreditCardPurchases />} />
        <Route path="/recurring" element={<Recurring />} />
        <Route path="/debts" element={<Debts />} />
        <Route path="/debts/:id" element={<DebtDetail />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/projection" element={<Projection />} />

      </Route>

      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>

  )

}