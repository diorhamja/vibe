import React, { useState, forwardRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import axios from "axios";
import { useEvents } from "../context/EventContext";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddEvent = ({ open, onClose, onEventAdded }) => {
  const { setRefresh } = useEvents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState(15);
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (!date || !time) {
        setError("Please select both date and time");
        setLoading(false);
        return;
      }

      if (!title.trim()) {
        setError("Please enter a title");
        setLoading(false);
        return;
      }

      if (!description.trim()) {
        setError("Please enter a description");
        setLoading(false);
        return;
      }

      const eventData = new FormData();
      eventData.append("title", title);
      eventData.append("description", description);

      const dateObject = new Date(date);
      eventData.append("date", dateObject.toISOString());

      eventData.append("time", time);

      eventData.append("capacity", capacity);
      eventData.append("price", price);

      if (imageFile) {
        eventData.append("profilePicture", imageFile);
      }

      console.log("Sending date:", dateObject.toISOString());
      console.log("Sending time:", time);

      for (let [key, value] of eventData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await axios.post(
        "http://localhost:8000/api/events",
        eventData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      onEventAdded(res.data);

      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setCapacity(15);
      setPrice(0);
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create event.");
    } finally {
      setRefresh(true);
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#FFFFFF",
          p: 3,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          height: "75vh",
          width: "40vw",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "24px",
          color: "#2D3748",
          pb: 2,
        }}
      >
        Create New Event
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            position: "relative",
            border: "2px dashed #ccc",
            borderRadius: 2,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            overflow: "hidden",
            cursor: "pointer",
            bgcolor: "#fff",
          }}
          onClick={() => document.getElementById("event-image-input").click()}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Box sx={{ textAlign: "center", color: "#999" }}>
              <AddAPhotoIcon sx={{ fontSize: 40 }} />
              <Typography variant="body2">
                Click to upload event image
              </Typography>
            </Box>
          )}
          <input
            id="event-image-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Box>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#2D3748",
                fontFamily: "inherit",
              }}
            >
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                console.log("Title changed:", e.target.value);
                setTitle(e.target.value);
              }}
              placeholder="Enter event title"
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #E2E8F0",
                borderRadius: "12px",
                fontSize: "16px",
                fontFamily: "inherit",
                backgroundColor: "#FFFFFF",
                outline: "none",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
                color: "black",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4299E1")}
              onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#2D3748",
                fontFamily: "inherit",
              }}
            >
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                console.log("Description changed:", e.target.value);
                setDescription(e.target.value);
              }}
              placeholder="Describe your event..."
              rows={4}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #E2E8F0",
                borderRadius: "12px",
                fontSize: "16px",
                fontFamily: "inherit",
                backgroundColor: "#FFFFFF",
                outline: "none",
                transition: "all 0.2s ease",
                resize: "vertical",
                minHeight: "100px",
                boxSizing: "border-box",
                color: "black",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4299E1")}
              onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2D3748",
                  fontFamily: "inherit",
                }}
              >
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  console.log("Date changed:", e.target.value);
                  setDate(e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #E2E8F0",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  backgroundColor: "#FFFFFF",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  color: "black",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4299E1")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                required
              />
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2D3748",
                  fontFamily: "inherit",
                }}
              >
                Time *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  console.log("Time changed:", e.target.value);
                  setTime(e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #E2E8F0",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  backgroundColor: "#FFFFFF",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  color: "black",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4299E1")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2D3748",
                  fontFamily: "inherit",
                }}
              >
                Capacity *
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => {
                  console.log("Capacity changed:", e.target.value);
                  setCapacity(e.target.value);
                }}
                min="1"
                max="500"
                placeholder="Max attendees"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #E2E8F0",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  backgroundColor: "#FFFFFF",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  color: "black",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4299E1")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                required
              />
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2D3748",
                  fontFamily: "inherit",
                }}
              >
                Price *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  console.log("Price changed:", e.target.value);
                  setPrice(e.target.value);
                }}
                min="0"
                step="0.01"
                placeholder="0.00"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #E2E8F0",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  backgroundColor: "#FFFFFF",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  color: "black",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4299E1")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                required
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "#FED7D7",
                border: "1px solid #E53E3E",
                borderRadius: "8px",
                color: "#C53030",
                fontSize: "14px",
                fontWeight: "500",
                color: "red",
              }}
            >
              {error}
            </div>
          )}
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 3 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            px: 4,
            py: 1.5,
            backgroundColor: "#4299E1",
            "&:hover": {
              backgroundColor: "#3182CE",
            },
            "&:disabled": {
              backgroundColor: "#CBD5E0",
            },
          }}
        >
          {loading ? "Creating..." : "Create Event"}
        </Button>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            mr: 2,
            px: 3,
            py: 1.5,
            color: "#4A5568",
            borderColor: "#E2E8F0",
            "&:hover": {
              backgroundColor: "#F7FAFC",
            },
          }}
          variant="outlined"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEvent;
