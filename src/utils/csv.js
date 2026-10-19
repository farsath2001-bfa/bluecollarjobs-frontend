// Build a CSV file in the browser and download it (opens cleanly in Excel, incl. Arabic text)
const cell = (v) => {
  if (v === null || v === undefined) return "";
  let s = Array.isArray(v) ? v.join("; ") : String(v);
  // Stop spreadsheet formula injection from user-typed text
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function downloadCsv(filename, columns, rows) {
  const lines = [columns.map((c) => cell(c.label)).join(",")];
  rows.forEach((r) => lines.push(columns.map((c) => cell(c.value(r))).join(",")));
  // BOM so Excel reads UTF-8
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
