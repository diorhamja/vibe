import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FinishAlert from "./FinishAlert";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventDetail = ({ open, event, onClose }) => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [reserved, setReserved] = useState(false);
  const [hasReservation, setHasReservation] = useState(false);
  const [existingReservation, setExistingReservation] = useState(null);
  const [isFinishOpen, setIsFinishOpen] = useState(false);

  if (!event) return null;

  useEffect(() => {
    const checkReservation = async () => {
      if (!event || !user) return;

      try {
        const res = await axios.post(
          "http://localhost:8000/api/reservations/check",
          {
            event: event._id,
            user: user._id,
          },
          { withCredentials: true }
        );

        setHasReservation(res.data.hasReservation);
        setExistingReservation(res.data.reservation || null);
      } catch (err) {
        console.error("Error checking reservation:", err);
      }
    };

    checkReservation();
  }, [event, user]);

  const handleReserve = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/reservations",
        {
          event: event._id,
          user: user._id,
          noReservations: quantity,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      setIsFinishOpen(true);
      setReserved(true);
    } catch (error) {
      console.error(
        "Failed to create reservation:",
        error.response?.data || error.message
      );
    }
  };

  const backgroundImage = event.image;
  const isPast = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    return eventDate < today;
  })();

  return (
    <>
      <FinishAlert open={isFinishOpen} onClose={() => setIsFinishOpen(false)} />

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "#0f172a",
            color: "white",
            position: "relative",
            height: "75vh",
          },
        }}
      >
        <Box sx={{ position: "relative", height: "35vh" }}>
          <Box
            component="img"
            src={backgroundImage}
            alt={event.title}
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100%",
              background:
                "linear-gradient(to bottom, rgba(15,23,42,0) 50%, #0f172a 100%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: 24,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              src={event.business?.profilePicture}
              alt={event.business?.name}
              sx={{ width: 48, height: 48 }}
            />
            <Box>
              <Typography variant="h5" fontWeight={700} color="white">
                {event.title}
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.85)">
                {event.business?.name || "Business Name"}
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 3,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.4)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.6)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ padding: 3 }}>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255,255,255,0.9)", mb: 2, lineHeight: 1.6 }}
          >
            {event.description || "No description provided."}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <CalendarMonthIcon sx={{ color: "#cbd5e1" }} />
            <Typography variant="body2" color="#cbd5e1">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <AccessTimeIcon sx={{ color: "#cbd5e1" }} />
            <Typography variant="body2" color="#cbd5e1">
              {event.time}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <SellOutlinedIcon sx={{ color: "#22c55e" }} />
            <Typography variant="body2" fontWeight={600} color="#22c55e">
              ${event.price} / ticket
            </Typography>
          </Box>

          {hasReservation ? (
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#1e293b",
                borderRadius: 2,
                border: "1px solid #334155",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="success.main"
                gutterBottom
              >
                🎉 You're already booked!
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.9)">
                You reserved{" "}
                <strong>{existingReservation?.noReservations || 1}</strong>{" "}
                ticket{existingReservation?.noReservations > 1 ? "s" : ""}.
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "rgba(255,255,255,0.6)" }}
              >
                Show up early and enjoy the event! ✨
              </Typography>
            </Box>
          ) : (
            <>
              <Typography
                variant="body2"
                color="rgba(255,255,255,0.8)"
                mb={1}
                mt={2}
              >
                Available Spots: {event.spotsLeft || "N/A"}
              </Typography>

              <TextField
                type="number"
                label="Tickets"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: event.spotsLeft || 10,
                  },
                  sx: { color: "white" },
                  endAdornment: (
                    <InputAdornment position="end">x</InputAdornment>
                  ),
                }}
                InputLabelProps={{ style: { color: "#cbd5e1" } }}
                fullWidth
                sx={{
                  mt: 1,
                  input: { color: "white" },
                  label: { color: "white" },
                }}
              />
            </>
          )}
        </DialogContent>

        {!hasReservation && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => {
                if (user) {
                  handleReserve();
                } else {
                  navigate("/login");
                }
              }}
              variant={reserved ? "outlined" : "contained"}
              color="success"
              fullWidth
              size="large"
              disabled={reserved}
            >
              {reserved
                ? "Reserved"
                : `Reserve ${quantity} Ticket${quantity > 1 ? "s" : ""}`}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default EventDetail;
