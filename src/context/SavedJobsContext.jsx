import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedIds, saveJob, unsaveJob, errorMessage } from "../service/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const SavedJobsContext = createContext(null);
const EMPTY = new Set();

// Keeps the set of saved job ids in sync with the backend so every card shows the right state
export const SavedJobsProvider = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [storedIds, setIds] = useState(() => new Set());
  const canSave = Boolean(user?.token) && user.role !== "admin";
  const ids = canSave ? storedIds : EMPTY;

  useEffect(() => {
    if (!canSave) return;
    getSavedIds()
      .then(({ data }) => setIds(new Set(data)))
      .catch(() => {});
  }, [canSave, user?.token]);

  const toggle = useCallback(
    async (jobId) => {
      if (!user) {
        toast("Log in to save jobs", "error");
        navigate("/login", { state: { from: window.location.pathname } });
        return;
      }
      const wasSaved = ids.has(jobId);
      // Update the UI first, roll back if the request fails
      setIds((prev) => {
        const next = new Set(prev);
        wasSaved ? next.delete(jobId) : next.add(jobId);
        return next;
      });
      try {
        await (wasSaved ? unsaveJob(jobId) : saveJob(jobId));
        toast(wasSaved ? "Removed from saved jobs" : "Job saved");
      } catch (err) {
        setIds((prev) => {
          const next = new Set(prev);
          wasSaved ? next.add(jobId) : next.delete(jobId);
          return next;
        });
        toast(errorMessage(err), "error");
      }
    },
    [ids, user, toast, navigate]
  );

  const value = useMemo(() => ({ savedIds: ids, isSaved: (id) => ids.has(id), toggleSave: toggle }), [ids, toggle]);
  return <SavedJobsContext.Provider value={value}>{children}</SavedJobsContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSavedJobs = () => useContext(SavedJobsContext);
