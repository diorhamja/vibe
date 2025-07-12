import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import EventProvider from "./context/EventProvider.jsx";
import DialogProvider from "./context/DialogProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter>
        <AuthProvider>
          <EventProvider>
            <DialogProvider>
              <App />
            </DialogProvider>
          </EventProvider>
        </AuthProvider>
      </BrowserRouter>
    </LocalizationProvider>
  </StrictMode>
);
