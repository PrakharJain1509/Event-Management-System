import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Chatbot from "../components/Chatbot";

interface Event {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  location_id: number;
  status_id: number;
}

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication required.");
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/events/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.success) {
          const approvedEvents = data.data.filter(
            (event: Event) => event.status_id === 2
          );
          setEvents(approvedEvents);
        } else {
          setError("Failed to fetch events.");
        }
      } catch (error) {
        setError("Error fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="relative">
      <div className="home-page min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Upcoming Events
          </h1>
          <div className="event-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="event-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  {event.title}
                </h2>
                <p className="text-gray-600 mt-2">
                  Date: {new Date(event.start_time).toLocaleString().slice(0, 10)}
                </p>
                <Link
                  to={`/event/${event.id}`}
                  className="btn btn-primary mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <Chatbot />
      </div>
    </div>
  );
};

export default HomePage;