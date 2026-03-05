import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { QueryClientProvider } from "@tanstack/react-query"

import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import { queryClient } from "./api/queryClient"

import "./styles/variables.css"
import "./styles/global.css"

ReactDOM.createRoot(
  document.getElementById("root")!
).render(

  <React.StrictMode>

    <QueryClientProvider client={queryClient}>

      <AuthProvider>

        <BrowserRouter>

          <App />

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#676e7c",
                color: "#f1f5f9",
                border: "1px solid #1f2937"
              }
            }}
          />

        </BrowserRouter>

      </AuthProvider>

    </QueryClientProvider>

  </React.StrictMode>

)