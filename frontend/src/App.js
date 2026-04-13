import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import logger from "./services/logger";

import Login from "./components/Login";
import Signup from "./components/Signup";
import HomePage from "./components/HomePage";
import Timeline from "./components/Timeline";
import Summary from "./components/Summary";
import Profile from "./components/Profile";
import Capsule from "./components/Capsule";
import AddCapsule from "./components/AddCapsule";
import ViewCapsules from "./components/ViewCapsules";

function RouteLogger() {
  const location = useLocation();
  useEffect(() => {
    logger.info('App', 'Route changed', location.pathname);
  }, [location.pathname]);
  return null;
}

function App() {
  useEffect(() => {
    logger.info('App', 'MemoryVault application mounted');
  }, []);

  return (
    <Router>
      <RouteLogger />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/home/timeline" element={<Timeline />} />
        <Route path="/home/summary" element={<Summary />} />
        <Route path="/home/profile" element={<Profile />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/home/capsule" element={<Capsule />} />
        <Route path="/add-capsule" element={<AddCapsule />} />
        <Route path="/view-capsules" element={<ViewCapsules />} />
        </Routes>
    </Router>
  );
}

export default App;