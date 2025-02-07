import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AdminDashboard.css";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
}

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, userRole } = useAuth();
  const navigate = useNavigate();

  // Token retrieval
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    // Ensure user is logged in and has admin role
    if (!isLoggedIn || userRole !== "admin") {
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
        const response = await fetch("http://localhost:3000/api/events/", {
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

        // Map the cleaned events to the correct structure for rendering
        const mappedEvents = data.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: new Date(event.start_time).toLocaleString().slice(0, 10),
          time: new Date(event.start_time).toTimeString().split(' ')[0],
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

  const mapStatus = (statusId: number): "pending" | "approved" | "rejected" | "cancelled" => {
    switch (statusId) {
      case 1:
        return "pending";
      case 2:
        return "approved";
      case 3:
        return "rejected";
      case 4:
        return "cancelled";
      default:
        return "pending";
    }
  };

  const handleEventAction = (id: number, action: "approve" | "reject" | "cancel") => {
  const token = localStorage.getItem("authToken");
  if (token) {
    const newStatusId =
      action === "approve" ? 2 : action === "reject" ? 3 : 4;

    fetch(`http://localhost:3000/api/events/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ status_id: newStatusId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEvents(
            events.map((event) =>
              event.id === id
                ? {
                    ...event,
                    status:
                      action === "cancel"
                        ? "cancelled"
                        : action === "approve"
                        ? "approved"
                        : "rejected",
                  }
                : event
            )
          );
          // Reload the page after the status is updated
          window.location.reload(); // This reloads the current page
        }
      })
      .catch((error) => console.error("Error updating event status:", error));
  }
};

  if (!isLoggedIn || userRole !== "admin") {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="event-requests">
        <h2>Event Requests</h2>

        {isLoading && <p>Loading events...</p>}
        {error && <p className="error">{error}</p>}

        {!isLoading && !error && events.length === 0 && (
          <p>No events found.</p>
        )}

        {!isLoading &&
          !error &&
          events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>Date: {event.date}</p>
              <p>{event.description}</p>
              <div className="event-actions">
                {event.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleEventAction(event.id, "approve")}
                      className="btn btn-secondary"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleEventAction(event.id, "reject")}
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                  </>
                )}

                {event.status === "approved" && (
                  <button
                    onClick={() => handleEventAction(event.id, "cancel")}
                    className="btn btn-danger"
                  >
                    Cancel
                  </button>
                )}

                {/* Do not show anything for rejected events */}
                {event.status === "rejected" && null}

                <span className={`status ${event.status}`}>
                  Status: {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
