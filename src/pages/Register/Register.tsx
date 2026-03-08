import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import styles from "./Register.module.css"

import { registerRequest } from "../../services/auth.service"

export default function Register() {

    const navigate = useNavigate()

    const [form, setForm] = useState({

        email: "",
        password: "",
        name: "",
        phone: ""

    })

    function change(key: string, value: string) {

        setForm(p => ({ ...p, [key]: value }))

    }

    async function submit(e: React.FormEvent) {

        e.preventDefault()

        try {

            await registerRequest(form)

            toast.success("Usuario creado")

            navigate("/login")

        } catch {

            toast.error("Error al registrar")

        }

    }

    return (

        <div className={styles.container}>

            <form
                className={styles.card}
                onSubmit={submit}
            >

                <h1 className={styles.title}>
                    Crear cuenta
                </h1>

                <label className={styles.label}>
                    Nombre
                </label>

                <input
                    className={styles.input}
                    value={form.name}
                    onChange={e => change("name", e.target.value)}
                />

                <label className={styles.label}>
                    Email
                </label>

                <input
                    className={styles.input}
                    type="email"
                    value={form.email}
                    onChange={e => change("email", e.target.value)}
                />

                <label className={styles.label}>
                    Teléfono
                </label>

                <input
                    className={styles.input}
                    value={form.phone}
                    onChange={e => change("phone", e.target.value)}
                />

                <label className={styles.label}>
                    Contraseña
                </label>

                <input
                    className={styles.input}
                    type="password"
                    value={form.password}
                    onChange={e => change("password", e.target.value)}
                />

                <button className={styles.button}>
                    Crear cuenta
                </button>

                <p className={styles.loginLink}>
                    ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
                </p>

            </form>

        </div>

    )

}