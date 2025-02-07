"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Calendar from "react-big-calendar"
import { startOfWeek } from "date-fns"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = Calendar.momentLocalizer(startOfWeek)

const BookSeminarHallPage = () => {
  const [hallName, setHallName] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter()

  const [events, setEvents] = useState([
    {
      title: "Booked",
      start: new Date(2023, 6, 10, 10, 0),
      end: new Date(2023, 6, 10, 12, 0),
    },
    {
      title: "Booked",
      start: new Date(2023, 6, 11, 14, 0),
      end: new Date(2023, 6, 11, 16, 0),
    },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send a POST request to your API
    // For now, we'll just log the data and redirect
    console.log({ hallName, date, startTime, endTime, description })
    alert("Seminar hall booking request submitted!")
    router.push("/")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book Seminar Hall</h1>
      <div className="mb-8">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="hallName" className="block mb-1">
            Hall Name
          </label>
          <input
            type="text"
            id="hallName"
            value={hallName}
            onChange={(e) => setHallName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="date" className="block mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="startTime" className="block mb-1">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block mb-1">
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border rounded"
            rows={4}
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit Booking Request
        </button>
      </form>
    </div>
  )
}

export default BookSeminarHallPage

