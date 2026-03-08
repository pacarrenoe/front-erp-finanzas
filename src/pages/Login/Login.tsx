import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import styles from "./Login.module.css"

import { loginRequest } from "../../services/auth.service"
import { useAuth } from "../../context/AuthContext"

export default function Login() {

  const navigate = useNavigate()

  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault()

    try {

      const response = await loginRequest({
        email,
        password
      })

      const token = response.data.token

      login(token)

      sessionStorage.setItem(
        "userEmail",
        response.data.user.email
      )

      navigate("/")
      toast.success("Bienvenido")

    } catch {

      toast.error("Credenciales incorrectas")

    }

  }

  return (

    <div className={styles.container}>

      <form
        className={styles.card}
        onSubmit={handleSubmit}
      >

        <h1 className={styles.title}>
          Iniciar sesión
        </h1>

        <label className={styles.label}>
          Email
        </label>

        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className={styles.label}>
          Contraseña
        </label>

        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.button}>
          Entrar
        </button>

        <p className={styles.loginLink}>
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>

      </form>

    </div>

  )

}