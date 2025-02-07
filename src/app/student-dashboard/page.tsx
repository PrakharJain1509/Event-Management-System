"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Event {
  id: number
  title: string
  date: string
  description: string
  status: "pending" | "approved" | "rejected"
}

const StudentDashboard = () => {
  const [events, setEvents] = useState<Event[]>([])
  const { isLoggedIn, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn || userRole !== "student") {
      router.push("/login")
    }
  }, [isLoggedIn, userRole, router])

  useEffect(() => {
    // Fetch student's events from API
    // For now, we'll use placeholder data
    setEvents([
      {
        id: 1,
        title: "Tech Talk",
        date: "2023-07-30",
        description: "A talk on emerging technologies",
        status: "pending",
      },
      {
        id: 2,
        title: "Coding Workshop",
        date: "2023-08-05",
        description: "Hands-on coding workshop",
        status: "approved",
      },
    ])
  }, [])

  if (!isLoggedIn || userRole !== "student") {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Your Event Requests</h2>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border p-4 rounded-lg">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-600">Date: {event.date}</p>
              <p className="mt-2">{event.description}</p>
              <p className="mt-2 font-semibold">
                Status:{" "}
                <span
                  className={`${event.status === "approved" ? "text-green-600" : event.status === "rejected" ? "text-red-600" : "text-yellow-600"}`}
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <Link href="/place-request" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Place New Event Request
        </Link>
      </div>
    </div>
  )
}

export default StudentDashboard

