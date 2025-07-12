import React, { useState, useEffect } from "react";
import EventContext from "./EventContext";
import axios from "axios";

const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/events");

        if (selectedDate) {
          const filtered = res.data.filter((event) => {
            const eventDate = new Date(event.date);
            const selected = new Date(selectedDate);

            return (
              eventDate.getFullYear() === selected.getFullYear() &&
              eventDate.getMonth() === selected.getMonth() &&
              eventDate.getDate() === selected.getDate()
            );
          });
          setEvents(filtered);
        } else {
          setEvents(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();
  }, [selectedDate]);

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            latlng: `${lat},${lng}`,
            key: import.meta.env.VITE_API_KEY,
          },
        }
      );

      if (res.data.status === "OK") {
        const result =
          res.data.results.find(
            (r) =>
              r.types.includes("street_address") ||
              r.types.includes("premise") ||
              r.types.includes("route")
          ) || res.data.results[0];

        return result.formatted_address;
      } else {
        console.error("Geocoding failed:", res.data.status);
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
    }
    return null;
  };

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        selectedEvent,
        setSelectedEvent,
        fetchAddress,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
