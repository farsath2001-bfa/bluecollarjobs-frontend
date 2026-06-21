// import React from "react";
// import Navbar from "./Components/Navbar";
// import Home from "./pages/Home";
// import Job from "./pages/Job";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Company from "./pages/Company";
// import CompanyDetails from "./pages/CompanyDetails";
// import JobDetails from "./pages/JobDetails";
// import Apply from "./pages/Apply";
// import SavedJobs from "./pages/Savejob";
// import Admin from "./pages/Admin";
// import ProtectedRoute from "./pages/ProtectedRoute";
// import CandidateDashboard from "./pages/CandidateDashboard";
// import AppliedJobs from "./pages/AppliedJobs";
// import AdminJobs from "./pages/AdminJobs";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Footer from "./Components/Footer";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. Components (Ensure capital "C" in Components)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 2. Root Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Admin from "./pages/admin/Admin";
import ProtectedRoute from "./pages/auth/ProtectedRoute";

// 3. Company Pages (Nested inside pages/company)
import Company from "./pages/company/Company"; // Note: Ensure you have a Company.jsx here or fix path if name differs
import CompanyDetails from "./pages/company/CompanyDetails";

// 4. Dashboard Pages
import CandidateDashboard from "./pages/dashboard/CandidateDashboard";

// 5. Job Pages (Nested inside pages/jobs)
import Job from "./pages/jobs/Job";
import JobDetails from "./pages/jobs/JobDetails";
import Apply from "./pages/jobs/Apply";
import AppliedJobs from "./pages/jobs/AppliedJobs";
import SavedJobs from "./pages/jobs/SaveJob"; // Matches your filename "SaveJob.jsx"
import AdminJobs from "./pages/admin/AdminJobs";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Job />} />
        <Route path="/jobs/:id" element={<JobDetails/>}/>
        <Route path="/companies" element={<Company />} />
        <Route path="/company/:id" element={<CompanyDetails />} />
        <Route path="/apply/:id" element={<Apply />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/saved" element={<SavedJobs/>}/>
        <Route path="/applied" element={<AppliedJobs/>}/>
        <Route path="/admin/jobs"element={<ProtectedRoute roleRequired="admin"> <AdminJobs /></ProtectedRoute>}/>
        <Route path="/dashboard" element={<ProtectedRoute><CandidateDashboard/></ProtectedRoute>}/>
        <Route path="/admin" element={<ProtectedRoute roleRequired="admin"><Admin /></ProtectedRoute>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
  
}

export default App;