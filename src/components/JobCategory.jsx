import React from "react";
import { Link } from "react-router-dom";
import {
  FaCar, FaBolt, FaWrench, FaTools, FaBroom, FaShieldAlt, FaMotorcycle,
  FaHardHat, FaBoxes, FaConciergeBell, FaUtensils, FaBriefcase, FaSnowflake, FaCalculator,
} from "react-icons/fa";

const ICONS = [
  [/driv/i, FaCar],
  [/electr/i, FaBolt],
  [/plumb/i, FaWrench],
  [/ac |hvac|a\/c/i, FaSnowflake],
  [/techn|mechanic|maint/i, FaTools],
  [/clean|housekeep/i, FaBroom],
  [/secur|guard/i, FaShieldAlt],
  [/deliver|rider|courier/i, FaMotorcycle],
  [/constr|mason|carpen|paint|weld|labou?r/i, FaHardHat],
  [/wareh|store|logist|cargo/i, FaBoxes],
  [/recep|front/i, FaConciergeBell],
  [/cook|chef|kitchen|hospit|waiter/i, FaUtensils],
  [/account|cashier/i, FaCalculator],
];

// Returns an icon element (not a component) for a trade name
const categoryIcon = (name = "") => {
  const IconType = (ICONS.find(([rx]) => rx.test(name)) || [null, FaBriefcase])[1];
  return React.createElement(IconType);
};

function JobCategory({ title, jobs }) {
  return (
    <Link to={`/jobs?category=${encodeURIComponent(title)}`} className="cat-tile">
      <span className="ico" aria-hidden="true">{categoryIcon(title)}</span>
      <span>
        <strong>{title}</strong>
        <small>{jobs} {jobs === 1 ? "opening" : "openings"}</small>
      </span>
    </Link>
  );
}

export default JobCategory;
