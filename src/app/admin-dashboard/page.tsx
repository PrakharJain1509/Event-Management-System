"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "next/navigation"

interface Event {
  id: number
  title: string
  date: string
  description: string
  status: "pending" | "approved" | "rejected"
}

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([])
  const { isLoggedIn, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn || userRole !== "admin") {
      router.push("/login")
    }
  }, [isLoggedIn, userRole, router])

  useEffect(() => {
    // Fetch events from API
    // For now, we'll use placeholder data
    setEvents([
      {
        id: 1,
        title: "Tech Symposium",
        date: "2023-07-15",
        description: "Annual technology symposium",
        status: "pending",
      },
      {
        id: 2,
        title: "Cultural Fest",
        date: "2023-07-20",
        description: "College cultural festival",
        status: "pending",
      },
      {
        id: 3,
        title: "Career Fair",
        date: "2023-07-25",
        description: "Job fair for graduating students",
        status: "pending",
      },
    ])
  }, [])

  const handleEventAction = (id: number, action: "approve" | "reject") => {
    setEvents(events.map((event) => (event.id === id ? { ...event, status: action } : event)))
  }

  if (!isLoggedIn || userRole !== "admin") {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Event Requests</h2>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border p-4 rounded-lg">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-600">Date: {event.date}</p>
              <p className="mt-2">{event.description}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEventAction(event.id, "approve")}
                  className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                  disabled={event.status !== "pending"}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleEventAction(event.id, "reject")}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  disabled={event.status !== "pending"}
                >
                  Reject
                </button>
                <span className="ml-2 text-gray-600">
                  Status: {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

