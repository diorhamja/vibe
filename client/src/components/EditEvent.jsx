import React, { useState, forwardRef, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import axios from "axios";
import { useEvents } from "../context/EventContext";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditEvent = ({ open, event, onClose }) => {
  const { setRefresh } = useEvents();

  const formatDate = (isoString) => {
    return isoString ? new Date(isoString).toISOString().split("T")[0] : "";
  };

  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    date: formatDate(event.date),
    time: event.time,
    capacity: event.capacity,
    price: event.price,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(event.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

      const data = new FormData();

      const dateISO = new Date(formData.date).toISOString();

      data.append("date", dateISO);

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("time", formData.time);
      data.append("capacity", formData.capacity);
      data.append("price", formData.price);

      if (imageFile) {
        data.append("eventImage", imageFile);
      }
      console.log(data);

      const response = await axios.patch(
        `http://localhost:8000/api/events/${event._id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log(response.data);

      setFormData({});
      setImageFile(null);
      setImagePreview(null);

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update event");
    } finally {
      setRefresh(true);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      const confirmed = window.confirm(
        "Are you sure you want to delete this event?"
      );
      if (!confirmed) {
        setLoading(false);
        return;
      }

      await axios.delete(`http://localhost:8000/api/events/${event._id}`, {
        withCredentials: true,
      });

      setFormData({});
      setImageFile(null);
      setImagePreview(null);

      onClose();
      setRefresh(true);
    } catch (err) {
      console.error(err);
      setError("Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      color: "#e2e8f0",
      backgroundColor: "#1e293b",
      "& fieldset": {
        borderColor: "#475569",
        borderWidth: "2px",
      },
      "&:hover fieldset": {
        borderColor: "#64748b",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3b82f6",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#94a3b8",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#3b82f6",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          padding: 3,
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#f1f5f9",
          marginBottom: 2,
        }}
      >
        Edit Event
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mt: 1,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 180,
              border: "2px dashed #475569",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              cursor: "pointer",
              backgroundColor: "#1e293b",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#64748b",
                backgroundColor: "#334155",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("event-image-input").click();
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Event"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  color: "#94a3b8",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AddAPhotoIcon sx={{ fontSize: 40 }} />
                <Typography variant="body2">Upload Event Image</Typography>
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

          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            placeholder="Enter event title"
            sx={textFieldStyles}
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
            placeholder="Write something about your event..."
            sx={textFieldStyles}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              sx={textFieldStyles}
            />
            <TextField
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              sx={textFieldStyles}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              fullWidth
              required
              sx={textFieldStyles}
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
              sx={textFieldStyles}
            />
          </Box>

          {error && (
            <Typography
              sx={{
                color: "#ef4444",
                textAlign: "center",
                backgroundColor: "#fef2f2",
                padding: 2,
                borderRadius: 1,
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ paddingX: 3, paddingBottom: 2, gap: 2 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            fontWeight: 600,
            paddingX: 4,
            paddingY: 1.5,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#2563eb",
            },
            "&:disabled": {
              backgroundColor: "#64748b",
              color: "#94a3b8",
            },
          }}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "#fc5879",
            color: "#ffffff",
            fontWeight: 600,
            paddingX: 4,
            paddingY: 1.5,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#d13655",
            },
            "&:disabled": {
              backgroundColor: "#a35565",
              color: "#8c7e82",
            },
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: "#94a3b8",
            fontWeight: 500,
            paddingX: 4,
            paddingY: 1.5,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#1e293b",
              color: "#e2e8f0",
            },
            "&:disabled": {
              color: "#475569",
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEvent;
