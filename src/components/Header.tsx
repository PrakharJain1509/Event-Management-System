import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./Header.css"

const Header = () => {
  const { isLoggedIn, userRole, logout } = useAuth()

  return (
    <header className="header">
      <nav className="nav-container">
        <Link to="/" className="logo">
          College Events
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          {isLoggedIn && userRole === "admin" && (
            <>
              <li>
                <Link to="/admin-dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/place-request">Place Request</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
          {isLoggedIn && userRole === "student" && (
            <>
              <li>
                <Link to="/student-dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/place-request">Place Request</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header

