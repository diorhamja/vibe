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

const EventCardGrid = () => {
  const { events } = useEvents();

  return (
    <Grid container spacing={3} sx={{ padding: 0 }}>
      {events.map((event) => (
        <Grid item size={6} key={event._id}>
          <EventCard event={event} size="small" />
        </Grid>
      ))}
    </Grid>
  );
};

export default EventCardGrid;
