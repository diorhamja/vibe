import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Avatar,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useLoadScript } from "@react-google-maps/api";
import { useAuth } from "../context/AuthContext";

const libraries = ["places"];

const BusinessRegister = () => {
  const { setUser, userLocation } = useAuth();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_API_KEY,
    libraries,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      const map = new window.google.maps.Map(document.createElement("div"));
      placesService.current = new window.google.maps.places.PlacesService(map);
    }
  }, [isLoaded]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddressSearch = (value) => {
    setAddressInput(value);

    if (value.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        { input: value, types: ["establishment", "geocode"] },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setPredictions(predictions.slice(0, 3));
          } else {
            setPredictions([]);
          }
        }
      );
    } else {
      setPredictions([]);
    }
  };

  const handlePlaceSelect = (place) => {
    if (!place || !placesService.current) return;

    placesService.current.getDetails(
      { placeId: place.place_id, fields: ["geometry", "formatted_address"] },
      (placeDetails, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          placeDetails
        ) {
          const location = placeDetails.geometry.location;
          setCoordinates({ lat: location.lat(), lng: location.lng() });
          setAddressInput(placeDetails.formatted_address);
          setPredictions([]);
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const finalCoords =
        coordinates ||
        (userLocation ? { lat: userLocation[0], lng: userLocation[1] } : null);

      if (!finalCoords) {
        setError("Please select a valid address");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", "business");
      formData.append("address", addressInput);

      if (profilePicFile) {
        formData.append("profilePicture", profilePicFile);
      }

      formData.append("location[coordinates][]", finalCoords.lat);
      formData.append("location[coordinates][]", finalCoords.lng);

      const response = await axios.post(
        "http://localhost:8000/api/users/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setUser(response.data.user);
      navigate("/business");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  if (!isLoaded) return null;

  return (
    <Box
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Paper
        style={{
          width: "100%",
          maxWidth: "380px",
          padding: "32px",
          borderRadius: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <Typography
            style={{
              color: "#2563eb",
              fontSize: "24px",
              fontWeight: "700",
              fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              letterSpacing: "-0.02em",
            }}
          >
            Register your Business!
          </Typography>
          <IconButton
            onClick={() => navigate("/")}
            style={{
              color: "#2563eb",
              padding: "8px",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(37, 99, 235, 0.2)",
            }}
          >
            <HomeRoundedIcon />
          </IconButton>
        </Box>

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <input
            accept="image/*"
            type="file"
            id="upload-profile-pic"
            onChange={handleProfilePicChange}
            style={{ display: "none" }}
          />
          <label htmlFor="upload-profile-pic">
            <Avatar
              src={previewUrl}
              style={{
                width: "80px",
                height: "80px",
                border: "3px solid #3b82f6",
                cursor: "pointer",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              }}
            >
              {!previewUrl && <CameraAltIcon style={{ color: "#3b82f6" }} />}
            </Avatar>
          </label>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Business Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginBottom: "16px" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "8px",
                "& fieldset": { borderColor: "#d1d5db", borderWidth: "2px" },
                "&:hover fieldset": { borderColor: "#3b82f6" },
                "&.Mui-focused fieldset": {
                  borderColor: "#2563eb",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputBase-input": { color: "#1f2937", fontSize: "16px" },
              "& .MuiInputLabel-root": { color: "#6b7280" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: "16px" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "8px",
                "& fieldset": { borderColor: "#d1d5db", borderWidth: "2px" },
                "&:hover fieldset": { borderColor: "#3b82f6" },
                "&.Mui-focused fieldset": {
                  borderColor: "#2563eb",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputBase-input": { color: "#1f2937", fontSize: "16px" },
              "& .MuiInputLabel-root": { color: "#6b7280" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: "16px" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "8px",
                "& fieldset": { borderColor: "#d1d5db", borderWidth: "2px" },
                "&:hover fieldset": { borderColor: "#3b82f6" },
                "&.Mui-focused fieldset": {
                  borderColor: "#2563eb",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputBase-input": { color: "#1f2937", fontSize: "16px" },
              "& .MuiInputLabel-root": { color: "#6b7280" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
            }}
          />

          <Box style={{ position: "relative", marginBottom: "16px" }}>
            <TextField
              fullWidth
              label="Address"
              value={addressInput}
              onChange={(e) => handleAddressSearch(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <LocationOnIcon
                    style={{ color: "#3b82f6", marginRight: "8px" }}
                  />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#d1d5db", borderWidth: "2px" },
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2563eb",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputBase-input": { color: "#1f2937", fontSize: "16px" },
                "& .MuiInputLabel-root": { color: "#6b7280" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
              }}
            />

            {predictions.length > 0 && (
              <Box
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                }}
              >
                {predictions.map((prediction) => (
                  <Box
                    key={prediction.place_id}
                    onClick={() => handlePlaceSelect(prediction)}
                    style={{
                      padding: "12px",
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <Typography style={{ color: "#333", fontSize: "14px" }}>
                      {prediction.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {error && (
            <Typography
              style={{
                color: "#dc2626",
                fontSize: "14px",
                marginBottom: "16px",
                padding: "10px",
                backgroundColor: "rgba(254, 226, 226, 0.9)",
                borderRadius: "6px",
                border: "2px solid #fca5a5",
                fontWeight: "500",
              }}
            >
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              fontWeight: "600",
              textTransform: "none",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Create Account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BusinessRegister;
