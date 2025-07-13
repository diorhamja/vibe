import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BusinessReservations = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/reservations/business",
          {
            withCredentials: true,
          }
        );
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        p: 4,
        bgcolor: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(4px)",
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h5" fontWeight={600} color="#5E6B8D" gutterBottom>
        View All Reservations
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {events.length === 0 ? (
        <Typography>No reservations found.</Typography>
      ) : (
        events.map((event) => (
          <Accordion key={event._id} sx={{ mb: 2, borderRadius: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box>
                <Typography variant="h6">{event.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  — {event.time} | Total Reservations:{" "}
                  {event.reservations.length}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} elevation={1}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Tickets</TableCell>
                      <TableCell>Reservation ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {event.reservations.map((res) => (
                      <TableRow key={res._id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              src={res.user.profilePicture}
                              alt={res.user.name}
                            />
                            <Typography>{res.user.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{res.user.email}</TableCell>
                        <TableCell>{res.noReservations}</TableCell>
                        <TableCell>{res._id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Paper>
  );
};

export default BusinessReservations;
