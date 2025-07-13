import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { setUser, userLocation } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const [lat, lng] = userLocation;

      const location = {
        type: "Point",
        coordinates: [lat, lng],
      };

      const response = await axios.post(
        "http://localhost:8000/api/users/register",
        {
          name,
          email,
          password,
          location,
        },
        { withCredentials: true }
      );

      setUser(response.data.user);
      navigate("/");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during registration.");
      }
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 420,
        padding: 5,
        borderRadius: 5,
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Grid container justifyContent="flex-end">
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
          <HomeRoundedIcon fontSize="medium" />
        </IconButton>
      </Grid>

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 600, color: "#4c4a64", mb: 2 }}
      >
        Create Account
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          required
        />

        {error && (
          <Typography
            color="error"
            variant="body2"
            sx={{ mt: 1, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 4,
            mb: 2,
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
          Register
        </Button>

        <Typography align="center" variant="body2" sx={{ mt: 0 }}>
          Already have an account?{" "}
          <Button
            onClick={() => navigate("/login")}
            sx={{
              color: "#4c4a64",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                color: "#6a8caf",
              },
            }}
          >
            Login
          </Button>
        </Typography>
      </Box>
    </Paper>
  );
};

export default Register;
