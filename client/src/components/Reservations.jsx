import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import EventCard from "./EventCard";
import { useEvents } from "../context/EventContext";

const Reservations = () => {
  const { user } = useAuth();
  const { selectedDate, refresh, setRefresh } = useEvents();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserReservations();
    setRefresh(false);
  }, [selectedDate, refresh, user]);

  const fetchUserReservations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8000/api/reservations/user",
        { withCredentials: true }
      );

      console.log(res.data);

      if (selectedDate) {
        const filtered = res.data.filter((reservation) => {
          const eventDate = new Date(reservation.date);
          const selected = new Date(selectedDate);
          return (
            eventDate.getFullYear() === selected.getFullYear() &&
            eventDate.getMonth() === selected.getMonth() &&
            eventDate.getDate() === selected.getDate()
          );
        });
        setReservations(filtered);
      } else {
        setReservations(res.data);
      }
    } catch (err) {
      setError("Failed to fetch reservations");
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper
      sx={{
        p: 4,
        bgcolor: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(4px)",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h5" fontWeight={600} color="#5E6B8D" gutterBottom>
        My Reservations
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {reservations.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 8,
          }}
        >
          <Typography variant="h6" color="#5E6B8D" gutterBottom>
            No Reservations Found
          </Typography>
          <Typography variant="body1" color="#7D8BA5" textAlign="center">
            {selectedDate
              ? "No reservations found for the selected date"
              : "You haven't made any reservations yet"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ padding: 0 }}>
          {reservations.map((reservation) => (
            <Grid item size={3} key={reservation._id}>
              <EventCard event={reservation} size="small" />
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

export default Reservations;
