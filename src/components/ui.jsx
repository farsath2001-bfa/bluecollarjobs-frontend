import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { resolveLogo, initials } from "../utils/format";
import { translate } from "../i18n";

export function CompanyLogo({ logo, name, size = "" }) {
  const src = resolveLogo(logo);
  return (
    <div className={`co-logo ${size}`} aria-hidden="true">
      {src ? <img src={src} alt="" loading="lazy" /> : <span className="letters">{initials(name)}</span>}
    </div>
  );
}

export function PageHead({ title, children, crumb }) {
  return (
    <header className="page-head">
      <div className="container">
        {crumb && <div className="crumb mb-2">{crumb}</div>}
        <h1 className="mb-0">{title}</h1>
        {children && <p>{children}</p>}
      </div>
    </header>
  );
}

export function EmptyState({ icon, title, children, action }) {
  return (
    <div className="empty">
      {icon && <div className="ico">{icon}</div>}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function StatusBadge({ status }) {
  return <span className={`status status-${status}`}>{translate(`status.${status}`)}</span>;
}

export function JobRowSkeleton({ count = 4 }) {
  return (
    <div className="job-list" aria-busy="true" aria-label={translate("common.loading")}>
      {Array.from({ length: count }).map((_, i) => (
        <div className="job-row" key={i}>
          <div className="skel" style={{ width: 56, height: 56 }} />
          <div>
            <div className="skel mb-2" style={{ width: "45%", height: 18 }} />
            <div className="skel" style={{ width: "70%", height: 14 }} />
          </div>
          <div className="skel" style={{ width: 110, height: 22 }} />
        </div>
      ))}
    </div>
  );
}

export function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;
  const nums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  return (
    <nav className="pager" aria-label="Pages">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><span className="flip-rtl d-inline-block">‹</span></button>
      {nums.map((n, i) =>
        n === "…" ? (
          <button key={`gap${i}`} type="button" disabled>…</button>
        ) : (
          <button key={n} type="button" aria-current={n === page ? "page" : undefined} onClick={() => onChange(n)}>{n}</button>
        )
      )}
      <button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page"><span className="flip-rtl d-inline-block">›</span></button>
    </nav>
  );
}

export function Modal({ title, onClose, children, footer, size = "" }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop-x" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-x ${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <h3>{title}</h3>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </header>
        <div className="body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}

// Replacement for window.confirm
export function ConfirmDialog({ title, message, confirmLabel = "Delete", busy, onConfirm, onCancel }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-light-line" onClick={onCancel}>{translate("common.cancel")}</button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </button>
        </>
      }
    >
      <p className="mb-0">{message}</p>
    </Modal>
  );
}

export function Spinner({ label }) {
  return (
    <div className="text-center py-5 text-steel" role="status">
      <div className="spinner-border text-primary mb-2" />
      <div>{label || translate("common.loading")}</div>
    </div>
  );
}

// Scroll to top on route change (keeps position when only the query string changes)
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
