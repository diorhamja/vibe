import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Header from "../components/Header";
import ShowBusinessEvents from "../components/ShowBusinessEvents";
import AddEvent from "../components/AddEvent";
import { useEvents } from "../context/EventContext";

const BusinessHome = () => {
  const { events, setEvents } = useEvents();

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleEventAdded = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    console.log("Event added:", newEvent);
  };

  return (
    <Box
      sx={{
        height: "95vh",
        display: "flex",
        flexDirection: "column",
        width: "90vw",
      }}
    >
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "90vw",
          justifyContent: "flex-end",
        }}
      >
        <Button onClick={handleOpenDialog}>
          <AddCircleOutlineOutlinedIcon sx={{ padding: 1, color: "#0f172a" }} />
        </Button>
      </Box>

      <ShowBusinessEvents />

      <AddEvent
        open={openDialog}
        onClose={handleCloseDialog}
        onEventAdded={handleEventAdded}
      />
    </Box>
  );
};

export default BusinessHome;
