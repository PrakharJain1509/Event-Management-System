import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./PlaceRequestPage.css";

const PlaceRequestPage = () => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [maxCapacity, setMaxCapacity] = useState<number>(0);
  const [isUnlimited, setIsUnlimited] = useState<boolean>(false);
  const [locationId, setLocationId] = useState<number>(1);

  const navigate = useNavigate();
  const { isLoggedIn, userRole } = useAuth();

  const locations = [
    { id: 1, name: "Civil" },
    { id: 2, name: "Chemical" },
    { id: 3, name: "Mechanical" },
    { id: 4, name: "Electrical" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startTime || !title || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    // Calculate end time (8 hours after start time)
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 8);

    const eventData = {
      title,
      description,
      location_id: locationId,
      start_time: startTime.toISOString().slice(0, 19).replace('T', ' '),
      end_time: endTime.toISOString().slice(0, 19).replace('T', ' '),
      price,
      max_capacity: isUnlimited ? null : maxCapacity,
      is_unlimited: isUnlimited
    };

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Authentication required");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Event created successfully. Awaiting admin approval.");
        navigate("/student-dashboard");
      } else {
        throw new Error(data.error || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert(error instanceof Error ? error.message : "Failed to create event");
    }
  };

  if (!isLoggedIn || (userRole !== "student" && userRole !== "admin")) {
  navigate("/login");
  return null;
}


  return (
    <div className="event-form-container">
      <h1>Create New Event</h1>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Event Title*</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time*</label>
          <DatePicker
            selected={startTime}
            onChange={(date: Date) => setStartTime(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-input"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="locationId">Location*</label>
          <select
            id="locationId"
            value={locationId}
            onChange={(e) => setLocationId(Number(e.target.value))}
            required
            className="form-input"
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (₹)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min="0"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxCapacity">Maximum Capacity</label>
          <input
            type="number"
            id="maxCapacity"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(Number(e.target.value))}
            min="1"
            className="form-input"
            disabled={isUnlimited}
          />
        </div>

        <div className="form-group checkbox-group">
          <label>

          </label>
        </div>

        <button type="submit" className="submit-button">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default PlaceRequestPage;
