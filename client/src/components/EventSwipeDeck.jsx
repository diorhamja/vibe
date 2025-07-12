import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { motion, AnimatePresence } from "framer-motion";
import { useEvents } from "../context/EventContext";
import EventCard from "./EventCard";
import EventCardGrid from "./EventCardGrid";
import { useDialog } from "../context/DialogContext";
import EventDetail from "./EventDetail";

const EventSwipeDeck = () => {
  const { events, setSelectedEvent } = useEvents();
  const { openDialog } = useDialog();

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  const handleVote = (dir) => {
    setDirection(dir);

    if (dir == "right") {
      openDialog(
        <EventDetail
          open={true}
          event={events[index]}
          onClose={() => openDialog(null)}
        />
      );
    }

    setTimeout(() => {
      setDirection(null);
      setIndex((prev) => prev + 1);
    }, 300);
  };

  const currentEvent = events[index];

  useEffect(() => {
    setSelectedEvent(currentEvent);
  }, [index]);

  if (!currentEvent) return <EventCardGrid />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        mt: 4,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 450,
          height: 500,
        }}
      >
        <AnimatePresence>
          <motion.div
            key={currentEvent._id}
            initial={{ x: 0, opacity: 1 }}
            animate={
              direction === "left"
                ? { x: -300, rotate: -20, opacity: 0 }
                : direction === "right"
                ? { x: 300, rotate: 20, opacity: 0 }
                : { x: 0, rotate: 0, opacity: 1 }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EventCard event={currentEvent} size="medium" />
          </motion.div>
        </AnimatePresence>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 6,
          mt: 4,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleVote("left")}
          sx={{ width: 60, height: 60, borderRadius: 50 }}
        >
          <ClearOutlinedIcon />
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleVote("right")}
          sx={{ width: 60, height: 60, borderRadius: 50 }}
        >
          <FavoriteOutlinedIcon
            style={{
              color: "#18fa07",
            }}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default EventSwipeDeck;
