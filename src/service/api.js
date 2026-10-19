import axios from "axios";
import { translate } from "../i18n";

export const API_URL = (import.meta.env.VITE_API_URL || "https://bluecollarjobs-backend.onrender.com/api").replace(/\/$/, "");
export const AUTH_KEY = "jobz.auth";

const API = axios.create({ baseURL: API_URL, timeout: 30000 });

// Attach the JWT to every request
API.interceptors.request.use((req) => {
  try {
    const auth = JSON.parse(localStorage.getItem(AUTH_KEY));
    if (auth?.token) req.headers.Authorization = `Bearer ${auth.token}`;
  } catch {
    /* no stored session */
  }
  return req;
});

// Expired / invalid token → tell AuthContext to log out
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && err.config?.headers?.Authorization) {
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(err);
  }
);

// Readable message from any axios error
export const errorMessage = (err, fallback) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ECONNABORTED") return translate("common.timeout");
  if (err?.message === "Network Error") return translate("common.network");
  return fallback || translate("common.genericError");
};

// The list endpoint returns { jobs, total, page, pages }; older builds returned a plain array
export const normalizeJobList = (data) =>
  Array.isArray(data) ? { jobs: data, total: data.length, page: 1, pages: 1 } : data;

// ---- Auth ----
export const loginUser      = (data) => API.post("/auth/login", data);
export const registerUser   = (data) => API.post("/auth/register", data);
export const getProfile     = ()     => API.get("/auth/profile");
export const updateProfile  = (data) => API.put("/auth/profile", data);
export const changePassword = (data) => API.put("/auth/password", data);
export const forgotPassword = (email) => API.post("/auth/forgot-password", { email });
export const resetPassword  = (token, password) => API.post(`/auth/reset-password/${token}`, { password });

// ---- Uploads (Cloudinary on the backend) ----
export const getUploadStatus = () => API.get("/uploads/status");
const upload = (path, file, onProgress) => {
  const form = new FormData();
  form.append("file", file);
  return API.post(path, form, {
    timeout: 120000,
    onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
  });
};
export const uploadCv   = (file, onProgress) => upload("/uploads/cv", file, onProgress);
export const getFileLink = (url) => API.get("/uploads/link", { params: { url } });

// Open an uploaded CV in a new tab through a short-lived signed link
// (direct Cloudinary links to PDFs/Word files are blocked on new accounts).
// The tab is opened first, inside the click, so pop-up blockers allow it.
export async function openFile(url) {
  if (!/res\.cloudinary\.com/.test(url)) {
    window.open(url, "_blank", "noopener");
    return;
  }
  const tab = window.open("", "_blank");
  try {
    const { data } = await getFileLink(url);
    if (tab) {
      tab.opener = null;
      tab.location.href = data.url;
    } else window.location.href = data.url;
  } catch (err) {
    tab?.close();
    throw err;
  }
}
export const uploadLogo = (file, onProgress) => upload("/uploads/logo", file, onProgress);

// ---- Jobs ----
export const getJobs    = (params) => API.get("/jobs", { params });
export const getJobMeta = ()       => API.get("/jobs/meta");
export const getJobById = (id)     => API.get(`/jobs/${id}`);

// ---- Applications ----
export const applyToJob          = (id, data) => API.post(`/applications/${id}`, data);
export const getMyApplications   = ()         => API.get("/applications/my");
export const withdrawApplication = (id)       => API.delete(`/applications/${id}`);

// ---- Saved jobs ----
export const getSavedJobs = ()   => API.get("/saved");
export const getSavedIds  = ()   => API.get("/saved/ids");
export const saveJob      = (id) => API.post(`/saved/${id}`);
export const unsaveJob    = (id) => API.delete(`/saved/${id}`);

// ---- Companies ----
export const getCompanies   = (params) => API.get("/companies", { params });
export const getCompanyById = (id)     => API.get(`/companies/${id}`);

// ---- Contact ----
export const sendContactMessage = (data) => API.post("/contact", data);

// ---- Admin ----
export const adminGetStats      = ()          => API.get("/admin/stats");
export const adminGetJobs       = (params)    => API.get("/jobs/admin/all", { params });
export const adminCreateJob     = (data)      => API.post("/jobs", data);
export const adminUpdateJob     = (id, data)  => API.put(`/jobs/${id}`, data);
export const adminDeleteJob     = (id)        => API.delete(`/jobs/${id}`);
export const adminCreateCompany = (data)      => API.post("/companies", data);
export const adminUpdateCompany = (id, data)  => API.put(`/companies/${id}`, data);
export const adminDeleteCompany = (id)        => API.delete(`/companies/${id}`);
export const adminGetApplications = (params)  => API.get("/applications", { params });
export const adminUpdateApplication = (id, data) => API.put(`/applications/${id}/status`, data);
export const adminGetUsers      = ()          => API.get("/admin/users");
export const adminSetUserRole   = (id, role)  => API.put(`/admin/users/${id}/role`, { role });
export const adminDeleteUser    = (id)        => API.delete(`/admin/users/${id}`);
export const adminGetMessages   = ()          => API.get("/admin/messages");
export const adminUpdateMessage = (id, data)  => API.put(`/admin/messages/${id}`, data);
export const adminDeleteMessage = (id)        => API.delete(`/admin/messages/${id}`);

export default API;
