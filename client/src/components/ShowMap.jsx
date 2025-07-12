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

const ShowMap = () => {
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
      mapRef.current.panTo(center);
      mapRef.current.setZoom(18);
    }
  }, [userLocation]);

  const handleMarkerClick = (event) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setSelectedEvent(event);
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
                  animation: "glowPulse 1.8s infinite ease-in-out",
                  "@keyframes glowPulse": {
                    "0%": {
                      filter: "drop-shadow(0 0 0px #fc7cd2)",
                      transform: "scale(1)",
                    },
                    "50%": {
                      filter: "drop-shadow(0 0 12px #fc7cd2)",
                      transform: "scale(1.1)",
                    },
                    "100%": {
                      filter: "drop-shadow(0 0 0px #fc7cd2)",
                      transform: "scale(1)",
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
                onMouseOver={() => setHoveredEvent({ ...event, lat, lng })}
                onMouseOut={() => setHoveredEvent(null)}
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

          {hoveredEvent && (
            <Box
              sx={{
                position: "absolute",
                left: "calc(40vw / 2)",
                top: "20px",
                transform: "translateX(-50%)",
                zIndex: 1000,
                pointerEvents: "none",
                width: 300,
              }}
            >
              <EventCard event={hoveredEvent} size="small" />
            </Box>
          )}
        </Map>
      </Box>
    </APIProvider>
  );
};

export default ShowMap;
