import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import ShowEvents from "../components/ShowEvents";
import ShowMap from "../components/ShowMap";

const Home = () => {
  return (
    <Box
      sx={{
        height: "92vh",
        display: "flex",
        flexDirection: "column",
        width: "90vw",
        borderRadius: 5,
      }}
    >
      <Header />

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Box sx={{ flex: 1.5, p: 2, overflowY: "auto" }}>
          <ShowEvents />
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 2,
          }}
        >
          <ShowMap />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
