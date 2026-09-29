import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import GovernmentLayout from './layouts/GovernmentLayout';

// Citizen public pages
import Home from './pages/Home';
import Search from './pages/Search';
import LandDetails from './pages/LandDetails';
import MapPage from './pages/MapPage';
import Login from './pages/Login';

// Citizen dashboard pages
import Overview from './pages/Dashboard/Overview';
import MyLand from './pages/Dashboard/MyLand';
import Applications from './pages/Dashboard/Applications';
import Notifications from './pages/Dashboard/Notifications';

// Government pages
import GovernmentLogin from './pages/government/GovernmentLogin';
import GovernmentDashboard from './pages/government/GovernmentDashboard';
import ProjectPlanning from './pages/government/ProjectPlanning';
import ImpactAnalysis from './pages/government/ImpactAnalysis';
import GovernmentReports from './pages/government/GovernmentReports';
import DataLayers from './pages/government/DataLayers';

// Placeholder pages
const Services = () => <div className="p-8"><h1 className="text-2xl font-bold">Services</h1><p>Services placeholder</p></div>;
const About = () => <div className="p-8"><h1 className="text-2xl font-bold">About BhuSetu</h1><p>About placeholder</p></div>;
const Help = () => <div className="p-8"><h1 className="text-2xl font-bold">Help Center</h1><p>Help placeholder</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Fullscreen standalone routes ── */}
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<Login />} />

        {/* ── Citizen dashboard (protected by DashboardLayout) ── */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="my-land" element={<MyLand />} />
          <Route path="applications" element={<Applications />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* ── Government login (public, no layout wrap needed) ── */}
        <Route path="/government/login" element={<GovernmentLogin />} />

        {/* ── Government portal (protected by GovernmentLayout) ── */}
        <Route path="/government" element={<GovernmentLayout />}>
          <Route path="dashboard" element={<GovernmentDashboard />} />
          <Route path="project-planning" element={<ProjectPlanning />} />
          <Route path="impact" element={<ImpactAnalysis />} />
          <Route path="reports" element={<GovernmentReports />} />
          <Route path="layers" element={<DataLayers />} />
        </Route>

        {/* ── Public citizen routes (wrapped in PublicLayout) ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/land/:id" element={<LandDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
