import React from "react";
import { Snackbar, Alert } from "@mui/material";

const FinishAlert = ({ open, onClose }) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ width: "100%", backgroundColor: "#38A169", color: "white" }}
      >
        Reservation complete! 🎉
      </Alert>
    </Snackbar>
  );
};

export default FinishAlert;
