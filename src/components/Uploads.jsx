import { useEffect, useRef, useState } from "react";
import { FaFileAlt, FaCloudUploadAlt, FaImage } from "react-icons/fa";
import { getUploadStatus, uploadCv, uploadLogo, openFile, errorMessage } from "../service/api";
import { useT } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import { resolveLogo } from "../utils/format";

// Ask the backend once per page load whether Cloudinary is configured
let statusPromise;
const uploadsEnabled = () => {
  statusPromise ??= getUploadStatus()
    .then((r) => !!r.data?.enabled)
    .catch(() => false);
  return statusPromise;
};

function useUploadsEnabled() {
  const [enabled, setEnabled] = useState(null);
  useEffect(() => {
    let alive = true;
    uploadsEnabled().then((v) => alive && setEnabled(v));
    return () => {
      alive = false;
    };
  }, []);
  return enabled;
}

const fileNameFromUrl = (url) => {
  try {
    const last = decodeURIComponent(new URL(url).pathname.split("/").pop() || "");
    // our uploads are "<userId>-<timestamp>-<name>.pdf"
    return last.replace(/^[a-f0-9]{24}-\d{10,}-/, "") || url;
  } catch {
    return url;
  }
};

/**
 * CV field: upload a file (PDF/DOC/DOCX/JPG/PNG ≤ 5 MB) or paste a link.
 * value = { url, name }; onChange({ url, name })
 */
export function CvField({ id = "resume", value, onChange }) {
  const t = useT();
  const toast = useToast();
  const enabled = useUploadsEnabled();
  const input = useRef(null);
  const [progress, setProgress] = useState(null);
  const [mode, setMode] = useState(null); // null = auto, "link" or "file"
  const [drag, setDrag] = useState(false);

  const url = value?.url || "";
  const isUploaded = /res\.cloudinary\.com/.test(url);
  const showLink = mode === "link" || (mode === null && (enabled === false || (url && !isUploaded)));

  const pick = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast("File is too large. Maximum size is 5 MB.", "error");
      return;
    }
    setProgress(0);
    try {
      const { data } = await uploadCv(file, setProgress);
      onChange({ url: data.url, name: data.name });
      toast(t("cv.uploaded"), "success");
    } catch (err) {
      toast(errorMessage(err, t("common.genericError")), "error");
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  };

  if (enabled === null && !url) return <div className="skel" style={{ height: 64 }} />;

  if (showLink) {
    return (
      <div>
        <input
          id={id}
          type="url"
          inputMode="url"
          className="form-control"
          placeholder={t("cv.linkPh")}
          value={url}
          onChange={(e) => onChange({ url: e.target.value, name: "" })}
        />
        {enabled && (
          <button type="button" className="link-btn small mt-2" onClick={() => setMode("file")}>
            {t("cv.useUpload")}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        className={`upload-box${drag ? " is-drag" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          pick(e.dataTransfer.files?.[0]);
        }}
      >
        <div className="upload-file">
          <div className="file-icon">{url ? <FaFileAlt /> : <FaCloudUploadAlt />}</div>
          <div style={{ minWidth: 0 }}>
            {url ? (
              <>
                <div className="file-name">{value?.name || fileNameFromUrl(url)}</div>
                <button type="button" className="link-btn small" onClick={() => openFile(url).catch((err) => toast(errorMessage(err), "error"))}>{t("cv.view")}</button>
              </>
            ) : (
              <>
                <div className="fw-semibold">{t("cv.upload")}</div>
                <div className="small text-steel">{t("cv.hint")}</div>
              </>
            )}
            {progress !== null && (
              <>
                <div className="small text-steel mt-1">{t("cv.uploading", { p: progress })}</div>
                <div className="upload-progress"><span style={{ width: `${progress}%` }} /></div>
              </>
            )}
          </div>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-light-line btn-sm" disabled={progress !== null} onClick={() => input.current?.click()}>
            {url ? t("cv.replace") : t("cv.upload")}
          </button>
          {url && (
            <button type="button" className="btn btn-ghost btn-sm" disabled={progress !== null} onClick={() => onChange({ url: "", name: "" })}>
              {t("cv.remove")}
            </button>
          )}
        </div>
        <input
          ref={input}
          id={id}
          type="file"
          hidden
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>
      <button type="button" className="link-btn small mt-2" onClick={() => setMode("link")}>
        {t("cv.orLink")}
      </button>
    </div>
  );
}

/**
 * Admin logo picker: upload an image (≤ 2 MB) — result is a URL written into `value`.
 * Bundled logo keys and pasted URLs still work through the text field next to it.
 */
export function LogoUpload({ value, onChange, preview = true }) {
  const toast = useToast();
  const enabled = useUploadsEnabled();
  const input = useRef(null);
  const [progress, setProgress] = useState(null);
  const src = resolveLogo(value);

  const pick = async (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast("Image is too large. Maximum size is 2 MB.", "error");
      return;
    }
    setProgress(0);
    try {
      const { data } = await uploadLogo(file, setProgress);
      onChange(data.url);
      toast("Logo uploaded", "success");
    } catch (err) {
      toast(errorMessage(err, "Logo didn't upload. Try again."), "error");
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="d-flex align-items-center gap-3 mt-2">
      {preview && (src ? <img src={src} alt="" className="logo-preview" /> : <div className="logo-preview d-grid" style={{ placeItems: "center" }}><FaImage className="text-steel" /></div>)}
      {enabled ? (
        <div>
          <button type="button" className="btn btn-light-line btn-sm" disabled={progress !== null} onClick={() => input.current?.click()}>
            {progress !== null ? `Uploading… ${progress}%` : src ? "Upload a different logo" : "Upload logo"}
          </button>
          <div className="small text-steel mt-1">PNG, JPG, WEBP or SVG, up to 2 MB</div>
          <input ref={input} type="file" hidden accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(e) => pick(e.target.files?.[0])} />
        </div>
      ) : (
        enabled === false && <div className="small text-steel">Uploads aren't set up yet. Pick a bundled logo or paste an image URL.</div>
      )}
    </div>
  );
}
