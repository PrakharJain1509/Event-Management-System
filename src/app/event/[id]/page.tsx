"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  price: number
  capacity: number
  description: string
  availableSlots: number
}

const EventPage = () => {
  const [event, setEvent] = useState<Event | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    // Fetch event details from API
    // For now, we'll use placeholder data
    setEvent({
      id: Number(params.id),
      title: "Sample Event",
      date: "2023-07-15",
      time: "14:00",
      location: "Main Auditorium",
      price: 10,
      capacity: 100,
      description: "This is a sample event description.",
      availableSlots: 50,
    })
  }, [params.id])

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send a POST request to your API
    // For now, we'll just log the data and show an alert
    console.log({ name, email, phone, eventId: event?.id })
    alert("Booking successful!")
    router.push("/")
  }

  if (!event) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{event.title}</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Time:</strong> {event.time}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <p>
          <strong>Price:</strong> ${event.price}
        </p>
        <p>
          <strong>Available Slots:</strong> {event.availableSlots}
        </p>
        <p className="mt-4">{event.description}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Book Event</h2>
      <form onSubmit={handleBooking} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Book Event
        </button>
      </form>
    </div>
  )
}

export default EventPage

