import { Routes, Route, Navigate } from "react-router-dom"

import Login from "../pages/Login/Login"
import Dashboard from "../pages/Dashboard/Dashboard"
import AppLayout from "../layouts/AppLayout/AppLayout"
import Accounts from "../pages/Accounts/Accounts"

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

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/accounts"
          element={<Accounts />}
        />

      </Route>

      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>

  )

}