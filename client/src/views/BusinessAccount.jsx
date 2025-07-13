import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Paper,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookOnlineOutlinedIcon from "@mui/icons-material/BookOnlineOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";
import Header from "../components/Header";
import EditProfile from "../components/EditProfile";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BusinessReservations from "../components/BusinessReservations";

const BusinessAccount = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!user) {
    return;
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          height: "80vh",
          width: "90vw",
          borderRadius: "0 0 20px 20px",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: 200,
            bgcolor: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: "20px",
            mt: 1,
          }}
        >
          <Box>
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Avatar
                src={user.profilePicture || ""}
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                  bgcolor: user.profilePicture ? "transparent" : "lightblue",
                  margin: "0 auto",
                }}
              >
                {!user.profilePicture && (
                  <AccountCircleIcon sx={{ fontSize: 50 }} />
                )}
              </Avatar>

              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="#5E6B8D"
                mt={1}
              >
                {user.name}
              </Typography>
            </Box>

            <Tabs
              orientation="vertical"
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTabs-indicator": {
                  left: 0,
                  backgroundColor: "#D4B8F5",
                },
              }}
            >
              <Tab
                label="Account"
                icon={<AccountCircleIcon />}
                iconPosition="start"
                sx={{
                  justifyContent: "flex-start",
                  minHeight: 48,
                  color: activeTab === 0 ? "#5E6B8D" : "#7D8BA5",
                  "&.Mui-selected": {
                    color: "#5E6B8D",
                    fontWeight: 500,
                  },
                }}
              />
              <Tab
                label="Reservations"
                icon={<BookOnlineOutlinedIcon />}
                iconPosition="start"
                sx={{
                  justifyContent: "flex-start",
                  minHeight: 48,
                  color: activeTab === 1 ? "#5E6B8D" : "#7D8BA5",
                  "&.Mui-selected": {
                    color: "#5E6B8D",
                    fontWeight: 500,
                  },
                }}
              />
              <Tab
                label="Settings"
                icon={<SettingsIcon />}
                iconPosition="start"
                sx={{
                  justifyContent: "flex-start",
                  minHeight: 48,
                  color: activeTab === 3 ? "#5E6B8D" : "#7D8BA5",
                  "&.Mui-selected": {
                    color: "#5E6B8D",
                    fontWeight: 500,
                  },
                }}
              />
            </Tabs>
          </Box>

          <Button
            startIcon={<HomeIcon />}
            onClick={() => navigate("/business")}
            sx={{
              mb: 2,
              mx: 2,
              color: "white",
              justifyContent: "center",
              textTransform: "none",
              borderRadius: "20px",
              backgroundColor: "#7D8BA5",
              fontWeight: "bold",
            }}
          >
            Go Home
          </Button>
        </Paper>

        <Box sx={{ flex: 1, p: 4, overflow: "auto" }}>
          {activeTab === 0 && <EditProfile />}

          {activeTab === 1 && <BusinessReservations />}

          {activeTab === 2 && (
            <Paper
              sx={{
                p: 4,
                bgcolor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(4px)",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={600}
                color="#5E6B8D"
                gutterBottom
              >
                Settings
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography color="#7D8BA5">
                Additional settings will appear here
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </>
  );
};

export default BusinessAccount;
