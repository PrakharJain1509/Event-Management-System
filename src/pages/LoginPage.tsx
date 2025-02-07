import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./LoginPage.css"

const API_BASE_URL = 'http://localhost:3000/api'

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/students/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store the token and user data
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('userData', JSON.stringify({
        id: data.student.id,
        name: data.student.name,
        email: data.student.email,
        role: data.student.role
      }))

      // Update auth context
      login(data.token, data.student.role)

      // Redirect based on user role
      if (data.student.role === 'admin') {
        navigate("/admin-dashboard")
      } else {
        navigate("/student-dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login')
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
