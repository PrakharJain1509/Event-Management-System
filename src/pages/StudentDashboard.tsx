import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./StudentDashboard.css";

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}

const StudentDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]); // Ensure it's an empty array initially
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isLoggedIn, userRole, setAuthStatus } = useAuth();
  const navigate = useNavigate();

  // Token retrievalF
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    // Ensure user is logged in and has student role
    if (!isLoggedIn || userRole !== "student") {
      navigate("/login");
    }
  }, [isLoggedIn, userRole, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      // Check if token exists in localStorage
      if (!token) {
        setError("You are not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/events/my-events", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          throw new Error("Unauthorized access. Please log in again.");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch events. Please try again later.");
        }

        const data = await response.json();

        // Log the response data to verify its structure
        console.log("Fetched Data:", data);

        // Filter out any entries containing 'Buffer' data
        const flattenedEvents = data.data // Access the 'data' field in the response
          .flat() // Flatten the array if it's nested
          .filter((event: any) => !event._buf); // Filter out events that contain Buffer data

        // Map the cleaned events to the correct structure for rendering
        const mappedEvents = flattenedEvents.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: new Date(event.start_time).toLocaleString(),
          description: event.description,
          status: mapStatus(event.status_id),
        }));

        setEvents(mappedEvents);
      } catch (error: any) {
        setError(error.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const mapStatus = (statusId: number): "pending" | "approved" | "rejected" => {
    switch (statusId) {
      case 1:
        return "pending";
      case 2:
        return "approved";
      case 3:
        return "rejected";
      default:
        return "pending";
    }
  };

  if (!isLoggedIn || userRole !== "student") {
    return null; // Return nothing if user is not logged in or is not a student
  }

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      <div className="event-requests">
        <h2>Your Event Requests</h2>

        {isLoading && <p>Loading events...</p>}
        {error && <p className="error">{error}</p>}

        {!isLoading && !error && events.length === 0 && (
          <p>No events found. Place a new event request.</p>
        )}

        {!isLoading &&
          !error &&
          events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>Date: {event.date}</p>
              <p>{event.description}</p>
              <p className={`status ${event.status}`}>
                Status: {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </p>
            </div>
          ))}
      </div>
      <Link to="/place-request" className="place-request-btn">
        Place New Event Request
      </Link>
    </div>
  );
};

export default StudentDashboard;
