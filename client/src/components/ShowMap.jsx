import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";
import EventCard from "./EventCard";
import EventDetail from "./EventDetail";
import { useDialog } from "../context/DialogContext";

const ShowMap = () => {
  const { openDialog } = useDialog();
  const { user, userLocation } = useAuth();
  const { events, selectedEvent, setSelectedEvent } = useEvents();

  const [hoveredEvent, setHoveredEvent] = useState(null);

  const mapRef = useRef(null);
  const navigate = useNavigate();

  const onMapLoad = (map) => {
    mapRef.current = map;

    if (userLocation) {
      const center = { lat: userLocation[0], lng: userLocation[1] };
      map.panTo(center);
      map.setZoom(18);
    }
  };

  useEffect(() => {
    if (userLocation && mapRef.current) {
      const center = { lat: userLocation[0], lng: userLocation[1] };
      mapRef.current.panTo(center);
      mapRef.current.setZoom(18);
    }
  }, [userLocation]);

  useEffect(() => {
    if (selectedEvent && mapRef.current) {
      const center = {
        lat: selectedEvent.business.location.coordinates[0],
        lng: selectedEvent.business.location.coordinates[1],
      };

      mapRef.current.panTo(center, { duration: 1000 });
    }
  }, [selectedEvent]);

  const handleMarkerClick = (event) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedEvent(event);
    openDialog(
      <EventDetail open={true} event={event} onClose={() => openDialog(null)} />
    );
  };

  const BlueDot = () => (
    <div
      style={{
        width: "18px",
        height: "18px",
        backgroundColor: "#00aeff",
        borderRadius: "50%",
        boxShadow: "0 0 8px #2196F3",
      }}
    />
  );

  const handleMarkerMouseOver = (event, mapEvent) => {
    setHoveredEvent({
      ...event,
      lat: event.business.location.coordinates[0],
      lng: event.business.location.coordinates[1],
    });
  };

  const handleMarkerMouseOut = () => {
    setHoveredEvent(null);
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_API_KEY}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "25px",
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        <Map
          onLoad={onMapLoad}
          mapId={import.meta.env.VITE_MAP_ID}
          colorScheme="DARK"
          style={{ width: "40vw", height: "82vh" }}
          defaultCenter={{ lat: userLocation[0], lng: userLocation[1] }}
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI
        >
          <AdvancedMarker
            position={{ lat: userLocation[0], lng: userLocation[1] }}
          >
            <BlueDot />
          </AdvancedMarker>

          {selectedEvent && (
            <AdvancedMarker
              position={{
                lat: selectedEvent.business.location.coordinates[0],
                lng: selectedEvent.business.location.coordinates[1],
              }}
            >
              <LocationOnOutlinedIcon
                sx={{
                  width: 35,
                  height: 35,
                  color: "#fc7cd2",
                  animation: "glowPulse 1.5s infinite ease-in-out",
                  "@keyframes glowPulse": {
                    "0%": {
                      filter:
                        "drop-shadow(0 0 0px #fc7cd2) hue-rotate(0deg) brightness(1)",
                      transform: "scale(1) rotate(0deg)",
                    },
                    "33%": {
                      filter:
                        "drop-shadow(0 0 15px #fc7cd2) drop-shadow(0 0 25px #ff69b4) hue-rotate(15deg) brightness(1.3)",
                      transform: "scale(1.1) rotate(2deg)",
                    },
                    "66%": {
                      filter:
                        "drop-shadow(0 0 25px #fc7cd2) drop-shadow(0 0 40px #ff1493) hue-rotate(30deg) brightness(1.5)",
                      transform: "scale(1.2) rotate(-2deg)",
                    },
                    "100%": {
                      filter:
                        "drop-shadow(0 0 0px #fc7cd2) hue-rotate(0deg) brightness(1)",
                      transform: "scale(1) rotate(0deg)",
                    },
                  },
                }}
              />
            </AdvancedMarker>
          )}

          {events.map((event, index) => {
            const lat = event.business.location.coordinates[0];
            const lng = event.business.location.coordinates[1];

            return (
              <AdvancedMarker
                key={index}
                position={{ lat, lng }}
                onClick={() => handleMarkerClick(event)}
                onMouseEnter={() => handleMarkerMouseOver(event)}
                onMouseLeave={handleMarkerMouseOut}
                style={{ cursor: "pointer" }}
              >
                <LocationOnOutlinedIcon
                  sx={{
                    width: 35,
                    height: 35,
                    color: "#ffc6ec",
                  }}
                />
              </AdvancedMarker>
            );
          })}
        </Map>
        {hoveredEvent && (
          <Box
            sx={{
              position: "absolute",
              left: "87%",
              top: "10%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              pointerEvents: "none",
              width: 300,
            }}
          >
            <EventCard event={hoveredEvent} size="small" />
          </Box>
        )}
      </Box>
    </APIProvider>
  );
};

export default ShowMap;
