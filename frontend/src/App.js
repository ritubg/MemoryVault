import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import HomePage from "./components/HomePage";
import Capsule from "./components/Capsule";
import AddCapsule from "./components/AddCapsule";
import ViewCapsules from "./components/ViewCapsules";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/capsule" element={<Capsule />} />
<Route path="/add-capsule" element={<AddCapsule />} />
<Route path="/view-capsules" element={<ViewCapsules />} />
      </Routes>
    </Router>
  );
}

export default App;