import { translate, getLanguage, LOCALES } from "../i18n";
import abcLogo from "../assets/CompanyLogos/abc.png";
import alnoorLogo from "../assets/CompanyLogos/alnoor.png";
import brightLogo from "../assets/CompanyLogos/bright.png";
import dewaLogo from "../assets/CompanyLogos/dewa.png";
import easLogo from "../assets/CompanyLogos/eas.png";
import emiratesLogo from "../assets/CompanyLogos/emirates.png";
import googleLogo from "../assets/CompanyLogos/google.png";
import lazordLogo from "../assets/CompanyLogos/lazord.png";
import talabatLogo from "../assets/CompanyLogos/talabat.png";

// Logos bundled with the app; admins pick these by key or paste an image URL instead
export const BUNDLED_LOGOS = {
  "emirates.png": { src: emiratesLogo, label: "Emirates Transport" },
  "talabat.png": { src: talabatLogo, label: "Talabat" },
  "alnoor.png": { src: alnoorLogo, label: "Al Noor" },
  "bright.png": { src: brightLogo, label: "Bright Facility" },
  "dewa.png": { src: dewaLogo, label: "Dewa" },
  "eas.png": { src: easLogo, label: "EAS Security" },
  "lazord.png": { src: lazordLogo, label: "Lazord" },
  "abc.png": { src: abcLogo, label: "ABC Cargo" },
  "google.png": { src: googleLogo, label: "Google" },
};

export const resolveLogo = (logo) => {
  if (!logo) return null;
  if (BUNDLED_LOGOS[logo]) return BUNDLED_LOGOS[logo].src;
  if (/^(https?:)?\/\//.test(logo) || logo.startsWith("data:")) return logo;
  return null;
};

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

// "AED 2500" / "2500" / "1900 + Accommodation" → consistent display
export const formatSalary = (salary) => {
  if (!salary || /not (disclosed|specified)/i.test(salary)) return null;
  let s = String(salary).trim();
  s = s.replace(/\d{4,}/g, (n) => Number(n).toLocaleString("en-US"));
  if (!/aed|dhs|dirham/i.test(s) && /^\d/.test(s)) s = `AED ${s}`;
  return s;
};

const locale = () => LOCALES[getLanguage()] || "en-GB";

export const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString(locale(), { day: "numeric", month: "short", year: "numeric" }) : "";

export const timeAgo = (date) => {
  if (!date) return "";
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 3600) return translate("common.justNow");
  if (diff < 86400) return translate("common.hoursAgo", { n: Math.floor(diff / 3600) });
  const days = Math.floor(diff / 86400);
  if (days === 1) return translate("common.yesterday");
  if (days < 30) return translate("common.daysAgo", { n: days });
  return formatDate(date);
};

export const isNew = (date) => date && Date.now() - new Date(date).getTime() < 3 * 86400 * 1000;

// Values stored in English in the database (trades, emirates, benefits, job types) → current language.
// Unknown values (custom trades, free-text locations) are shown as typed.
const label = (prefix) => (value) => {
  if (!value) return value;
  const key = `${prefix}.${value}`;
  const out = translate(key);
  return out === key ? value : out;
};
export const tCategory = label("cat");
export const tJobType = label("jobType");
export const tBenefit = label("benefit");
// "Al Quoz, Dubai" → each comma part translated if it's a known emirate
export const tLocation = (loc) => {
  if (!loc) return loc;
  const sep = ["ar", "ur"].includes(getLanguage()) ? "، " : ", ";
  return String(loc).split(/\s*,\s*/).map(label("emirate")).join(sep);
};
export const tEmirate = label("emirate");

// Closing-date info for a job: null when no date set
export const closingInfo = (expiresAt) => {
  if (!expiresAt) return null;
  const end = new Date(expiresAt);
  if (end.getTime() <= Date.now()) return { closed: true, text: translate("common.closed") };
  // Count calendar days, so a job closing "Thursday" reads the same all day Monday
  const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(end) - startOf(new Date())) / 86400000);
  if (days === 0) return { soon: true, text: translate("common.closesToday") };
  if (days === 1) return { soon: true, text: translate("common.closesTomorrow") };
  if (days <= 7) return { soon: true, text: translate("common.closesIn", { n: days }) };
  return { text: translate("common.closesOn", { date: formatDate(end) }) };
};

export const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah", "Al Ain"];

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Temporary"];

export const COMMON_CATEGORIES = [
  "Driver", "Electrician", "Plumber", "Technician", "Cleaning", "Security",
  "Delivery", "Construction", "Warehouse", "Hospitality", "Receptionist",
];

export const BENEFIT_OPTIONS = ["Accommodation", "Transport", "Visa", "Medical insurance", "Food allowance", "Overtime pay", "Annual ticket"];
