// WhatsApp click-to-chat helpers (wa.me works on phones and WhatsApp Web)

// Site-wide number for "WhatsApp us" and as a fallback for jobs without their own number.
// Set VITE_WHATSAPP_NUMBER in Vercel, e.g. 971501234567 (country code, no + or spaces).
export const SITE_WHATSAPP = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");

// "050 123 4567" / "+971 50 123 4567" / "00971501234567" → "971501234567"
export function toWhatsAppNumber(phone) {
  if (!phone) return "";
  let d = String(phone).replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0") && d.length === 10) d = `971${d.slice(1)}`; // UAE local mobile
  if (/^5\d{8}$/.test(d)) d = `971${d}`;
  return d.length >= 9 ? d : "";
}

export const waLink = (number, text) =>
  `https://wa.me/${number || ""}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
