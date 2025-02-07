import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface Booking {
  id: number
  eventId: number
  eventName: string
  userName: string
  userEmail: string
  status: "pending" | "approved" | "rejected"
}

interface Event {
  id: number
  title: string
  date: string
  time: string
  status: "pending" | "approved" | "rejected" | "cancelled"
}

const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const { isLoggedIn, userRole } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn || userRole !== "admin") {
      navigate("/login")
    }
  }, [isLoggedIn, userRole, navigate])

  useEffect(() => {
    // Fetch bookings and events from API
    // For now, we'll use placeholder data
    setBookings([
      {
        id: 1,
        eventId: 1,
        eventName: "Tech Symposium",
        userName: "John Doe",
        userEmail: "john@example.com",
        status: "pending",
      },
      {
        id: 2,
        eventId: 2,
        eventName: "Cultural Fest",
        userName: "Jane Smith",
        userEmail: "jane@example.com",
        status: "approved",
      },
      {
        id: 3,
        eventId: 3,
        eventName: "Career Fair",
        userName: "Bob Johnson",
        userEmail: "bob@example.com",
        status: "pending",
      },
    ])

    setEvents([
      { id: 1, title: "Tech Symposium", date: "2023-07-15", time: "10:00", status: "approved" },
      { id: 2, title: "Cultural Fest", date: "2023-07-20", time: "14:00", status: "approved" },
      { id: 3, title: "Career Fair", date: "2023-07-25", time: "11:00", status: "pending" },
    ])
  }, [])

  const handleBookingAction = (id: number, action: "approve" | "reject") => {
    setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status: action } : booking)))
  }

  const handleEventCancellation = (id: number) => {
    setEvents(events.map((event) => (event.id === id ? { ...event, status: "cancelled" } : event)))
  }

  if (!isLoggedIn || userRole !== "admin") {
    return null
  }

  const approvedEvents = events.filter((event) => event.status === "approved")

  return (
    <div className="manage-bookings-page">
      <h1>Manage Bookings</h1>
      <div className="approved-events">
        <h2>Approved Events</h2>
        {approvedEvents.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>
              Date: {event.date} at {event.time}
            </p>
            <button className="btn btn-danger" onClick={() => handleEventCancellation(event.id)}>
              Cancel Event
            </button>
          </div>
        ))}
      </div>
      <div className="bookings-list">
        <h2>Bookings</h2>
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <h3>{booking.eventName}</h3>
            <p>User: {booking.userName}</p>
            <p>Email: {booking.userEmail}</p>
            <p>Status: {booking.status}</p>
            <div className="booking-actions">
              <button
                className="btn btn-secondary"
                onClick={() => handleBookingAction(booking.id, "approve")}
                disabled={booking.status !== "pending"}
              >
                Approve
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleBookingAction(booking.id, "reject")}
                disabled={booking.status !== "pending"}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageBookingsPage

