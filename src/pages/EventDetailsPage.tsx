import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

interface Event {
  id: number
  title: string
  start_time: string
  end_time: string
  location_id: number
  status_id: number
  description: string
}

const EventDetailsPage = () => {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams<{ id: string }>()
  const [events, setEvents] = useState<Event[]>([]) // Store all events
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch all events from the main endpoint
        const response = await fetch("http://localhost:3000/api/events/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (data.success) {
          // Filter the event that matches the ID from URL
          const event = data.data.find((e: Event) => e.id === parseInt(id || ""))
          if (event) {
            setEvent(event)
          } else {
            setError("Event not found.")
          }
        } else {
          setError("Failed to fetch events.")
        }
      } catch (error) {
        setError("Error fetching events.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [id])

  if (loading) {
    return <div>Loading event details...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!event) {
    return <div>Event not found.</div>
  }

  return (
    <div className="event-details-page">
      <h1>{event.title}</h1>
      <div className="event-info">
        <p>
          <strong>Date:</strong> {new Date(event.start_time).toLocaleString().slice(0, 10)}
        </p>
        <p>
          <strong>Description:</strong> {event.description}
        </p>
      </div>
      <button onClick={() => navigate("/")} className="btn btn-secondary">Go Back</button>
    </div>
  )
}

export default EventDetailsPage
