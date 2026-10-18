import React, { useEffect, useState } from "react";
import { FaEnvelope, FaReply, FaTrash } from "react-icons/fa";
import AdminShell from "./AdminShell";
import { ConfirmDialog, EmptyState } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { adminGetMessages, adminUpdateMessage, adminDeleteMessage, errorMessage } from "../../service/api";
import { useToast } from "../../context/ToastContext";
import { timeAgo } from "../../utils/format";

function AdminMessages() {
  useTitle("Messages");
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    adminGetMessages()
      .then(({ data }) => setMessages(data))
      .catch((err) => toast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const setRead = async (m, isRead) => {
    try {
      const { data } = await adminUpdateMessage(m._id, { isRead });
      setMessages((list) => list.map((x) => (x._id === m._id ? data : x)));
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  };

  const remove = async () => {
    try {
      setBusy(true);
      await adminDeleteMessage(deleting._id);
      setMessages((list) => list.filter((x) => x._id !== deleting._id));
      toast("Message deleted");
      setDeleting(null);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  };

  const shown = unreadOnly ? messages.filter((m) => !m.isRead) : messages;

  return (
    <AdminShell title="Messages">
      <label className="d-inline-flex align-items-center gap-2 mb-3" style={{ cursor: "pointer" }}>
        <input type="checkbox" className="form-check-input m-0" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} />
        Unread only ({messages.filter((m) => !m.isRead).length})
      </label>

      {loading ? (
        <div className="skel" style={{ height: 240 }} />
      ) : shown.length === 0 ? (
        <EmptyState icon={<FaEnvelope />} title={messages.length ? "No unread messages" : "No messages yet"}>
          Messages sent from the Contact page appear here.
        </EmptyState>
      ) : (
        <div className="d-grid gap-2">
          {shown.map((m) => (
            <article key={m._id} className="panel panel-tight" style={!m.isRead ? { borderLeft: "4px solid var(--red)" } : undefined}>
              <div className="d-flex justify-content-between gap-3 flex-wrap">
                <div>
                  <strong>{m.subject || "No subject"}</strong>
                  <div className="small text-steel">
                    {m.name}, <a href={`mailto:${m.email}`}>{m.email}</a>{m.phone && <>, <a href={`tel:${m.phone}`}>{m.phone}</a></>} · {timeAgo(m.createdAt)}
                  </div>
                </div>
                <div className="d-flex gap-1 align-items-start">
                  <a className="btn btn-light-line btn-sm" href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Your message to Jobz Dxb"}`)}`} onClick={() => !m.isRead && setRead(m, true)}>
                    <FaReply /> Reply
                  </a>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRead(m, !m.isRead)}>{m.isRead ? "Mark unread" : "Mark read"}</button>
                  <button type="button" className="btn btn-ghost btn-sm text-danger" onClick={() => setDeleting(m)} aria-label="Delete message"><FaTrash /></button>
                </div>
              </div>
              <p className="prose mb-0 mt-2">{m.message}</p>
            </article>
          ))}
        </div>
      )}

      {deleting && (
        <ConfirmDialog title="Delete this message?" message={`The message from ${deleting.name} will be removed permanently.`} busy={busy} onConfirm={remove} onCancel={() => setDeleting(null)} />
      )}
    </AdminShell>
  );
}

export default AdminMessages;
