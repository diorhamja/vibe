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
        {
          input: value,
          types: ["establishment", "geocode"],
          location: new window.google.maps.LatLng(41.3275, 19.8189), // Tirana center
          radius: 50000,
          strictBounds: false,
        },
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
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 5,
          borderRadius: 5,
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <IconButton
            onClick={() => navigate("/")}
            sx={{
              color: "#6a8caf",
              transition: "0.3s",
              "&:hover": {
                color: "#88a2cf",
              },
            }}
          >
            <HomeRoundedIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 600, color: "#4c4a64", mb: 3 }}
        >
          Register Your Business
        </Typography>

        <Box
          display={"flex"}
          textAlign="center"
          mb={3}
          justifyContent={"center"}
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
              sx={{
                width: 80,
                height: 80,
                border: "3px solid #b8c9f0",
                backgroundColor: "#f0f4ff",
                cursor: "pointer",
              }}
            >
              {!previewUrl && (
                <CameraAltIcon sx={{ fontSize: 30, color: "#6a8caf" }} />
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
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "#f0f4ff",
                  "& fieldset": {
                    borderColor: "#b8c9f0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#88a2cf",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6a8caf",
                  },
                },
              }}
            />
          ))}

          <TextField
            label="Address"
            fullWidth
            required
            value={addressInput}
            onChange={(e) => handleAddressSearch(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <LocationOnIcon sx={{ color: "#6a8caf", mr: 1 }} />
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f0f4ff",
                "& fieldset": {
                  borderColor: "#b8c9f0",
                },
                "&:hover fieldset": {
                  borderColor: "#88a2cf",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6a8caf",
                },
              },
            }}
          />

          {predictions.length > 0 && (
            <Box
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              }}
            >
              {predictions.map((prediction) => (
                <Box
                  key={prediction.place_id}
                  onClick={() => handlePlaceSelect(prediction)}
                  sx={{
                    p: 1.5,
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    "&:last-child": { borderBottom: "none" },
                    fontSize: 14,
                  }}
                >
                  {prediction.description}
                </Box>
              ))}
            </Box>
          )}

          {error && (
            <Typography
              color="error"
              variant="body2"
              align="center"
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.4,
              backgroundColor: "#6a8caf",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 3,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#88a2cf",
              },
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
