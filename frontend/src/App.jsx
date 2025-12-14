import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { initAuth } from "./api";
import LandingPage from "./Landing/LandingPage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  useEffect(() => {
    initAuth();
  }, []);
  return (
    <>
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </>
    </>
  );
}

export default App;
