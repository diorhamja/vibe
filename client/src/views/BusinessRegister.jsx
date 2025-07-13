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
        (preds, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            preds
          ) {
            setPredictions(preds.slice(0, 3));
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
          maxWidth: "420px",
          padding: "32px",
          borderRadius: "24px",
          background: "rgba(255, 240, 246, 0.65)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          <IconButton
            onClick={() => navigate("/")}
            style={{
              color: "#6a5671",
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(106, 86, 113, 0.2)",
              padding: "6px",
              borderRadius: "8px",
            }}
          >
            <HomeRoundedIcon />
          </IconButton>
        </Box>

        <Typography
          style={{
            color: "#6a5671",
            fontSize: "26px",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Register your Business
        </Typography>

        <Box
          style={{
            display: "flex",
            textAlign: "center",
            marginBottom: "24px",
            alignItems: "center",
            justifyContent: "center",
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
                border: "3px solid #c3b6f4",
                cursor: "pointer",
                backgroundColor: "#f5efff",
                boxShadow: "0 4px 12px rgba(195, 182, 244, 0.4)",
              }}
            >
              {!previewUrl && (
                <CameraAltIcon style={{ color: "#a78bfa", fontSize: "30px" }} />
              )}
            </Avatar>
          </label>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          {[
            { label: "Business Name", value: name, setValue: setName },
            { label: "Email", value: email, setValue: setEmail, type: "email" },
            {
              label: "Password",
              value: password,
              setValue: setPassword,
              type: "password",
            },
          ].map(({ label, value, setValue, type = "text" }, i) => (
            <TextField
              key={i}
              label={label}
              type={type}
              fullWidth
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ marginBottom: "16px" }}
              InputProps={{
                style: {
                  background: "rgba(255, 255, 255, 0.85)",
                  borderRadius: "12px",
                },
              }}
              InputLabelProps={{ style: { color: "#6b7280" } }}
            />
          ))}

          <TextField
            label="Address"
            fullWidth
            required
            value={addressInput}
            onChange={(e) => handleAddressSearch(e.target.value)}
            style={{ marginBottom: "16px" }}
            InputProps={{
              startAdornment: (
                <LocationOnIcon style={{ color: "#a78bfa", marginRight: 8 }} />
              ),
              style: {
                background: "rgba(255, 255, 255, 0.85)",
                borderRadius: "12px",
              },
            }}
            InputLabelProps={{ style: { color: "#6b7280" } }}
          />

          {predictions.length > 0 && (
            <Box
              style={{
                background: "#fff",
                borderRadius: "10px",
                marginBottom: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              }}
            >
              {predictions.map((prediction) => (
                <Box
                  key={prediction.place_id}
                  onClick={() => handlePlaceSelect(prediction)}
                  style={{
                    padding: "12px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Typography style={{ fontSize: "14px" }}>
                    {prediction.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {error && (
            <Typography
              style={{
                color: "#dc2626",
                fontSize: "14px",
                marginBottom: "16px",
                background: "#fee2e2",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #fca5a5",
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
              backgroundColor: "#6a5671",
              color: "#fff",
              padding: "12px",
              borderRadius: "12px",
              fontWeight: "600",
              textTransform: "none",
              marginTop: "8px",
              boxShadow: "0 4px 16px rgba(106, 86, 113, 0.3)",
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
