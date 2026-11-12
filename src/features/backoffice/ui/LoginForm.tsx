import { useState, type FormEvent } from 'react'
import styles from './Admin.module.css'

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>
  notice?: string
}

export const LoginForm = ({ onLogin, notice }: LoginFormProps) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await onLogin(username.trim(), password)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.')
      setBusy(false)
    }
  }

  return (
    <main className={styles.loginPage}>
      <form className={styles.loginCard} onSubmit={submit} aria-label="Iniciar sesión">
        <img src={`${import.meta.env.BASE_URL}logo-hm.png`} alt="" className={styles.loginLogo} />
        <h1 className={styles.loginTitle}>Back office</h1>
        <p className={styles.muted}>Hockey Management · Próximos eventos</p>

        {notice ? (
          <p role="status" className={styles.notice}>
            {notice}
          </p>
        ) : null}

        <label className={styles.field}>
          <span className={styles.label}>Usuario</span>
          <input
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Contraseña</span>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error ? (
          <p role="alert" className={styles.formError}>
            {error}
          </p>
        ) : null}

        <button type="submit" className={styles.primary} disabled={busy}>
          {busy ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </main>
  )
}
