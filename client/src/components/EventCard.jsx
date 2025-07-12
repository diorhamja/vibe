import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useDialog } from "../context/DialogContext";
import EventDetail from "./EventDetail";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event, size = "medium" }) => {
  const { user } = useAuth();
  const { openDialog } = useDialog();

  const navigate = useNavigate();

  const isSmall = size === "small";
  const isPast = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    return eventDate < today;
  })();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return { day, month };
  };

  const { day, month } = formatDate(event.date);

  return (
    <Card
      onClick={() => {
        if (!user) {
          navigate("/login");
        } else {
          openDialog(
            <EventDetail
              open={true}
              event={event}
              onClose={() => openDialog(null)}
            />
          );
        }
      }}
      sx={{
        position: "relative",
        borderRadius: 4,
        height: isSmall ? 280 : "60vh",
        width: "100%",
        backgroundColor: "#0f172a",
        color: "white",
        boxShadow: 4,
        marginTop: 1,
        opacity: isPast ? 0.6 : 1,
        filter: isPast ? "grayscale(0.7)" : "none",
        transition: "transform 0.3s ease",
        cursor: isPast ? "default" : "pointer",
        "&:hover": {
          transform: isPast ? "none" : "translateY(-6px)",
        },
      }}
    >
      <Box sx={{ position: "relative", height: "100%" }}>
        <CardMedia
          component="img"
          image={event.image || "/bar-pic-default.jpg"}
          alt={event.title}
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />

        {!isSmall && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 150,
              background:
                "linear-gradient(180deg, transparent 0%, #0f172a 80%, #0f172a 100%)",
              zIndex: 1,
            }}
          />
        )}

        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            backgroundColor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            padding: "6px 12px",
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="white">
            {day}
          </Typography>
          <Typography
            variant="caption"
            color="white"
            sx={{ textTransform: "uppercase", fontWeight: 600 }}
          >
            {month}
          </Typography>
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: "rgba(34,197,94,0.2)",
            backdropFilter: "blur(8px)",
            padding: "6px 12px",
            borderRadius: 3,
            border: "1px solid rgba(34,197,94,0.4)",
            display: "flex",
            alignItems: "center",
            gap: 1,
            zIndex: 2,
          }}
        >
          <SellOutlinedIcon sx={{ fontSize: 18, color: "#22c55e" }} />
          <Typography variant="body2" fontWeight={600} color="white">
            ${event.price}
          </Typography>
        </Box>

        <CardContent
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            background: "transparent",
            padding: isSmall ? 2 : 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mb: 1,
              alignItems: "center",
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 16, color: "#cbd5e1" }} />
            <Typography
              variant="caption"
              fontWeight={600}
              color="#cbd5e1"
              fontSize={15}
            >
              {event.time}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.8)",
              mb: 0,
              fontWeight: 500,
            }}
            noWrap
          >
            {event.business?.name || "Business Name"}
          </Typography>

          <Typography
            variant={isSmall ? "h6" : "h5"}
            fontWeight={700}
            noWrap
            sx={{ color: "white" }}
          >
            {event.title}
          </Typography>

          {!isSmall && event.description && (
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              {event.description}
            </Typography>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export default EventCard;
