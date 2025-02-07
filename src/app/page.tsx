"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Event {
  id: number
  title: string
  date: string
  location: string
}

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    // Fetch events from API
    // For now, we'll use placeholder data
    setEvents([
      { id: 1, title: "Tech Symposium", date: "2023-07-15", location: "Main Auditorium" },
      { id: 2, title: "Cultural Fest", date: "2023-07-20", location: "College Grounds" },
      { id: 3, title: "Career Fair", date: "2023-07-25", location: "Seminar Hall A" },
    ])
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600">Date: {event.date}</p>
            <p className="text-gray-600">Location: {event.location}</p>
            <Link
              href={`/event/${event.id}`}
              className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage

