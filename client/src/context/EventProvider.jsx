import React, { useState, useEffect } from "react";
import EventContext from "./EventContext";
import axios from "axios";
import { useAuth } from "./AuthContext";

const EventProvider = ({ children }) => {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [refresh, setRefresh] = useState(false);

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
    setRefresh(false);
  }, [selectedDate, refresh, user]);

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        selectedEvent,
        setSelectedEvent,
        selectedDate,
        setSelectedDate,
        setRefresh,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
