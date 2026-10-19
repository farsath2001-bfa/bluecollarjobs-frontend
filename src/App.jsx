import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ScrollToTop, Spinner } from "./components/ui";
import { SavedJobsProvider } from "./context/SavedJobsContext";
import { useLang } from "./context/LanguageContext";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./pages/auth/ProtectedRoute";

import Job from "./pages/jobs/Job";
import JobDetails from "./pages/jobs/JobDetails";
import Apply from "./pages/jobs/Apply";
import AppliedJobs from "./pages/jobs/AppliedJobs";
import SavedJobs from "./pages/jobs/SaveJob";

import Company from "./pages/company/Company";
import CompanyDetails from "./pages/company/CompanyDetails";

import CandidateDashboard from "./pages/dashboard/CandidateDashboard";
import Profile from "./pages/dashboard/Profile";

// Admin pages load only when an admin opens them
const Admin = lazy(() => import("./pages/admin/Admin"));
const AdminJobs = lazy(() => import("./pages/admin/AdminJobs"));
const AdminCompanies = lazy(() => import("./pages/admin/AdminCompanies"));
const AdminApplications = lazy(() => import("./pages/admin/AdminApplications"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminAccount = lazy(() => import("./pages/admin/AdminAccount"));

const candidate = (el) => <ProtectedRoute roleRequired="candidate">{el}</ProtectedRoute>;
const admin = (el) => (
  <ProtectedRoute roleRequired="admin">
    <Suspense fallback={<Spinner />}>{el}</Suspense>
  </ProtectedRoute>
);

function App() {
  // Reading the language here re-renders every page when it changes
  useLang();
  return (
    <BrowserRouter>
      <SavedJobsProvider>
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Job />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/companies" element={<Company />} />
            <Route path="/company/:id" element={<CompanyDetails />} />
            <Route path="/companies/:id" element={<CompanyDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/apply/:id" element={candidate(<Apply />)} />
            <Route path="/dashboard" element={candidate(<CandidateDashboard />)} />
            <Route path="/profile" element={candidate(<Profile />)} />
            <Route path="/applied" element={candidate(<AppliedJobs />)} />
            <Route path="/saved" element={candidate(<SavedJobs />)} />

            <Route path="/admin" element={admin(<Admin />)} />
            <Route path="/admin/jobs" element={admin(<AdminJobs />)} />
            <Route path="/admin/companies" element={admin(<AdminCompanies />)} />
            <Route path="/admin/applications" element={admin(<AdminApplications />)} />
            <Route path="/admin/users" element={admin(<AdminUsers />)} />
            <Route path="/admin/messages" element={admin(<AdminMessages />)} />
            <Route path="/admin/account" element={admin(<AdminAccount />)} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </SavedJobsProvider>
    </BrowserRouter>
  );
}

export default App;
