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
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import axios from "axios";
import { useEvents } from "../context/EventContext";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddEvent = ({ open, onClose, onEventAdded }) => {
  const { setRefresh } = useEvents();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    capacity: 15,
    price: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

      if (!formData.title.trim() || !formData.description.trim()) {
        setError("Title and Description are required");
        return;
      }

      const data = new FormData();
      const dateISO = new Date(formData.date).toISOString();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("date", dateISO);
      data.append("time", formData.time);
      data.append("capacity", formData.capacity);
      data.append("price", formData.price);

      if (imageFile) {
        data.append("eventImage", imageFile);
      }

      const response = await axios.post(
        "http://localhost:8000/api/events",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      onEventAdded(response.data);
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        capacity: 15,
        price: 0,
      });
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create event");
    } finally {
      setRefresh(true);
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
        Create New Event
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box
            sx={{
              border: "2px dashed #475569",
              borderRadius: 2,
              height: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: "#1e293b",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#64748b",
                backgroundColor: "#334155",
              },
            }}
            onClick={() => document.getElementById("event-image-input").click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
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
            label="Event Title"
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

          <Box display="flex" gap={2}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
              sx={textFieldStyles}
            />
            <TextField
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
              sx={textFieldStyles}
            />
          </Box>

          <Box display="flex" gap={2}>
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
          {loading ? "Creating..." : "Create Event"}
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

export default AddEvent;
