import { useEffect } from "react";
import { translate, getLanguage } from "../i18n";

const SITE_NAME = "Jobz Dxb";

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

/**
 * Sets the tab title plus description / Open Graph / canonical tags, and optional JSON-LD
 * (used for Google for Jobs on the job page).
 *   useTitle("Driver jobs")
 *   useTitle(job.title, { description, image, jsonLd })
 */
export function useTitle(title, { description, image, jsonLd } = {}) {
  const lang = getLanguage();
  const jsonText = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : translate("seo.defaultTitle");
    const desc = description || translate("seo.defaultDesc");
    const url = window.location.origin + window.location.pathname;

    document.title = fullTitle;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:image", image || `${window.location.origin}/og-image.png`);
    setMeta("name", "twitter:card", "summary_large_image");
    setCanonical(url);
  }, [title, description, image, lang]);

  useEffect(() => {
    if (!jsonText) return undefined;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "page-jsonld";
    el.textContent = jsonText;
    document.getElementById("page-jsonld")?.remove();
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, [jsonText]);
}
