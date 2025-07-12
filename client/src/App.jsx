import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import PublicRoute from "./components/PublicRoute";
import "./App.css";
import BusinessRegister from "./views/BusinessRegister";
import AccountView from "./views/AccountView";
import BusinessHome from "./views/BusinessHome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route path="/account" element={<AccountView />} />
      <Route path="/register/business" element={<BusinessRegister />} />
      <Route path="/business" element={<BusinessHome />} />
    </Routes>
  );
}

export default App;
