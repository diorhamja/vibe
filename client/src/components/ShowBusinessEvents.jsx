import React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import { useEvents } from "../context/EventContext";
import EventCard from "./EventCard";
import { useAuth } from "../context/AuthContext";

const ShowBusinessEvents = () => {
  const { user } = useAuth();
  const { events, selectedDate } = useEvents();

  return (
    <Grid container spacing={3} sx={{ padding: 0 }}>
      {events
        .filter((event) => event.business._id === user._id)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((event) => (
          <Grid item size={3} key={event._id}>
            <EventCard event={event} size="small" />
          </Grid>
        ))}
    </Grid>
  );
};

export default ShowBusinessEvents;
