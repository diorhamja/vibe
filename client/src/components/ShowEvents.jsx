import React, { useState, useEffect } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
} from "@mui/material";
import ViewCarouselOutlinedIcon from "@mui/icons-material/ViewCarouselOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import axios from "axios";
import EventCardGrid from "./EventCardGrid";
import EventSwipeDeck from "./EventSwipeDeck";

const ShowEvents = () => {
  const [viewMode, setViewMode] = useState("swipe");

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newView) => newView && setViewMode(newView)}
          color="primary"
        >
          <ToggleButton value="swipe">
            <ViewCarouselOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="cards">
            <GridViewOutlinedIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === "swipe" ? <EventSwipeDeck /> : <EventCardGrid />}
    </Box>
  );
};

export default ShowEvents;
