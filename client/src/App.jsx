import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import BusinessRegister from "./views/BusinessRegister";
import AccountView from "./views/AccountView";
import BusinessHome from "./views/BusinessHome";
import BusinessProtectedRoute from "./components/BusinessProtectedRoute";
import BusinessAccount from "./views/BusinessAccount";
import { useAuth } from "./context/AuthContext";
import GuestRoute from "./components/GuestRoute";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/business" element={<BusinessRegister />} />
      </Route>

      <Route element={<GuestRoute />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/account" element={<AccountView />} />
      </Route>

      <Route element={<BusinessProtectedRoute />}>
        <Route path="/business" element={<BusinessHome />} />
        <Route path="/business/account" element={<BusinessAccount />} />
      </Route>
    </Routes>
  );
}

export default App;
