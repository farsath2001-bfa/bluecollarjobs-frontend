import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaThLarge, FaBookmark, FaFileAlt, FaUserEdit, FaSignOutAlt, FaCog, FaUserCircle } from "react-icons/fa";
import logo from "../assets/Images/logo-small.png";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils/format";
import { useT } from "../context/LanguageContext";
import LanguageSwitch from "./LanguageSwitch";

function Navbar() {
  const { user, isAdmin, isEmployer, logoutUser } = useAuth();
  const location = useLocation();
  // Menus remember the page they were opened on, so they close by themselves after navigation
  const [openOn, setOpenOn] = useState(null);
  const [menuOn, setMenuOn] = useState(null);
  const open = openOn === location.pathname;
  const menu = menuOn === location.pathname;
  const setOpen = (fn) => setOpenOn((fn(open) ? location.pathname : null));
  const setMenu = (fn) => setMenuOn((typeof fn === "function" ? fn(menu) : fn) ? location.pathname : null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const t = useT();

  // Close the user menu when clicking outside it
  useEffect(() => {
    if (!menu) return undefined;
    const onDown = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOn(null);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menu]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const links = [
    { to: "/", label: t("nav.home"), end: true },
    { to: "/jobs", label: t("nav.jobs") },
    { to: "/companies", label: t("nav.companies") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
    ...(!user ? [{ to: "/employers", label: t("nav.employers") }] : []),
  ];

  return (
    <nav className="site-nav" aria-label="Main">
      <div className="container inner position-relative">
        <Link to="/" className="brand">
          <img src={logo} alt="" />
          Jobz Dxb
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

        <div id="main-nav" className={`nav-collapse ${open ? "open" : ""}`}>
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end}>{l.label}</NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-sm btn-nav-login">{t("nav.login")}</Link>
                <Link to="/register" className="btn btn-sm btn-nav-cta">{t("nav.register")}</Link>
              </>
            ) : (
              <div className="user-menu" ref={menuRef}>
                <button type="button" className="user-chip" aria-expanded={menu} aria-haspopup="menu" onClick={() => setMenu((m) => !m)}>
                  <span className="avatar" lang="en">{initials(user.name)}</span>
                  <span>{user.name?.split(" ")[0]}</span>
                </button>
                {menu && (
                  <div className="dropdown-panel" role="menu">
                    <div className="who">
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                    {isEmployer ? (
                      <>
                        <Link to="/employer" role="menuitem"><FaThLarge /> {t("nav.employerDashboard")}</Link>
                        <Link to="/employer/jobs" role="menuitem"><FaCog /> {t("nav.myJobs")}</Link>
                        <Link to="/employer/applicants" role="menuitem"><FaFileAlt /> {t("nav.applicants")}</Link>
                        <Link to="/employer/company" role="menuitem"><FaUserCircle /> {t("nav.companyProfile")}</Link>
                      </>
                    ) : isAdmin ? (
                      <>
                        <Link to="/admin" role="menuitem"><FaCog /> {t("nav.adminPanel")}</Link>
                        <Link to="/admin/jobs" role="menuitem"><FaThLarge /> {t("nav.manageJobs")}</Link>
                        <Link to="/admin/applications" role="menuitem"><FaFileAlt /> {t("nav.adminApplications")}</Link>
                        <Link to="/admin/account" role="menuitem"><FaUserCircle /> {t("nav.myAccount")}</Link>
                      </>
                    ) : (
                      <>
                        <Link to="/dashboard" role="menuitem"><FaThLarge /> {t("nav.dashboard")}</Link>
                        <Link to="/applied" role="menuitem"><FaFileAlt /> {t("nav.applications")}</Link>
                        <Link to="/saved" role="menuitem"><FaBookmark /> {t("nav.saved")}</Link>
                        <Link to="/profile" role="menuitem"><FaUserEdit /> {t("nav.profile")}</Link>
                      </>
                    )}
                    <button type="button" role="menuitem" onClick={handleLogout}><FaSignOutAlt /> {t("nav.logout")}</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <LanguageSwitch />
      </div>
    </nav>
  );
}

export default Navbar;
