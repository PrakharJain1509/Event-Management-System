"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"

const PlaceRequestPage = () => {
  const [eventName, setEventName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const router = useRouter()
  const { isLoggedIn, userRole } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send a POST request to your API
    // For now, we'll just log the data and show an alert
    console.log({ eventName, eventDate, eventDescription })
    alert("Event request submitted successfully!")
    // Reset form fields
    setEventName("")
    setEventDate("")
    setEventDescription("")
    // Redirect to student dashboard
    router.push("/student-dashboard")
  }

  if (!isLoggedIn || userRole !== "student") {
    router.push("/login")
    return null
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Place Event Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="eventName" className="block mb-1">
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="eventDate" className="block mb-1">
            Event Date
          </label>
          <input
            type="date"
            id="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="eventDescription" className="block mb-1">
            Event Description
          </label>
          <textarea
            id="eventDescription"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
            className="w-full p-2 border rounded"
            rows={4}
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Submit Event Request
        </button>
      </form>
    </div>
  )
}

export default PlaceRequestPage

