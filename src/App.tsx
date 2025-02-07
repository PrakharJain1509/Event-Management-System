import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import AdminDashboard from "./pages/AdminDashboard"
import StudentDashboard from "./pages/StudentDashboard"
import PlaceRequestPage from "./pages/PlaceRequestPage"
import EventDetailsPage from "./pages/EventDetailsPage"
import ManageBookingsPage from "./pages/ManageBookingsPage"
import "./index.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/place-request" element={<PlaceRequestPage />} />
              <Route path="/event/:id" element={<EventDetailsPage />} />
              <Route path="/manage-bookings" element={<ManageBookingsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

