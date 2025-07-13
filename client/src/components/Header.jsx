import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalBarOutlinedIcon from "@mui/icons-material/LocalBarOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { selectedDate, setSelectedDate } = useEvents();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "25px",
        px: 2,
        py: 1,
        color: "#1c1c1c",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <LocalBarOutlinedIcon fontSize="large" color="darkblue" />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", letterSpacing: 1 }}
          >
            Vibe
          </Typography>
        </Box>

        <DatePicker
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          disablePast
          format="MMMM dd, yyyy"
          slots={{
            openPickerIcon: SearchIcon,
          }}
          slotProps={{
            textField: {
              variant: "standard",
              InputProps: { disableUnderline: true },
              sx: {
                width: "180px",
                borderRadius: "25px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.08)",
                paddingY: 1,
                paddingX: 2.5,
                transition: "all 0.2s ease",
                borderBottom: "none",
                "& .MuiInputBase-root": {
                  borderBottom: "none !important",
                },
                "& .MuiInputBase-input": {
                  color: selectedDate ? "black" : "transparent !important",
                },
              },
            },
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {!user ? (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/register/business")}
                sx={{ borderColor: "#1c1c1c", color: "#1c1c1c" }}
              >
                Become a Partner
              </Button>
            </>
          ) : (
            <>
              <Typography>{user.name}</Typography>
              <IconButton onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    if (user.role == "user") {
                      navigate("/account");
                    } else if (user.role == "business") {
                      navigate("/business/account");
                    } else {
                      navigate("/");
                    }
                    handleMenuClose();
                  }}
                >
                  Account
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                    handleMenuClose();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
