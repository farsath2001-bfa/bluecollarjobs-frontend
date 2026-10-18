import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaThLarge, FaBookmark, FaFileAlt, FaUserEdit, FaSignOutAlt, FaCog } from "react-icons/fa";
import logo from "../assets/Images/logo-small.png";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils/format";

function Navbar() {
  const { user, isAdmin, logoutUser } = useAuth();
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
    { to: "/", label: "Home", end: true },
    { to: "/jobs", label: "Find jobs" },
    { to: "/companies", label: "Companies" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
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
          aria-label={open ? "Close menu" : "Open menu"}
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
                <Link to="/login" className="btn btn-sm btn-nav-login">Log in</Link>
                <Link to="/register" className="btn btn-sm btn-nav-cta">Create account</Link>
              </>
            ) : (
              <div className="user-menu" ref={menuRef}>
                <button type="button" className="user-chip" aria-expanded={menu} aria-haspopup="menu" onClick={() => setMenu((m) => !m)}>
                  <span className="avatar">{initials(user.name)}</span>
                  <span>{user.name?.split(" ")[0]}</span>
                </button>
                {menu && (
                  <div className="dropdown-panel" role="menu">
                    <div className="who">
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                    {isAdmin ? (
                      <>
                        <Link to="/admin" role="menuitem"><FaCog /> Admin panel</Link>
                        <Link to="/admin/jobs" role="menuitem"><FaThLarge /> Manage jobs</Link>
                        <Link to="/admin/applications" role="menuitem"><FaFileAlt /> Applications</Link>
                      </>
                    ) : (
                      <>
                        <Link to="/dashboard" role="menuitem"><FaThLarge /> My dashboard</Link>
                        <Link to="/applied" role="menuitem"><FaFileAlt /> My applications</Link>
                        <Link to="/saved" role="menuitem"><FaBookmark /> Saved jobs</Link>
                        <Link to="/profile" role="menuitem"><FaUserEdit /> Edit profile</Link>
                      </>
                    )}
                    <button type="button" role="menuitem" onClick={handleLogout}><FaSignOutAlt /> Log out</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
