import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      {/* pública */}
      <Route path="/login" element={<Login />} />

      {/* protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 👇 cualquier ruta no definida */}
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Route>

      {/* fallback global por si acaso (opcional) */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}