import React, { useState, forwardRef } from "react";
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
        data.append("image", imageFile);
      }

      const response = await axios.patch(
        `http://localhost:8000/api/events/${event._id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log(response.data);
      setRefresh(true);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
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
              border: "2px dashed #ccc",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              cursor: "pointer",
              bgcolor: "#f9f9f9",
            }}
            onClick={() => document.getElementById("event-image-input").click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Event"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Box textAlign="center" color="#999">
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
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>

          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Event"}
        </Button>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEvent;
