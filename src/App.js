import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import DRPlanPage from "./pages/DRPlanPage";
import BackupPage from "./pages/BackupPage";
import LifecyclePolicyPage from "./pages/LifecyclePolicyPage";  

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dr-plan" element={<DRPlanPage />} />
            <Route path="/backup/:vmId" element={<BackupPage />} />
            <Route path="/lifecycle-policy" element={<LifecyclePolicyPage />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
