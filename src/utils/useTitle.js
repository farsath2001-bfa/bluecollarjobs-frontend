import { useEffect } from "react";

// Sets the browser tab title for a page
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Jobz Dxb` : "Jobz Dxb — Blue-collar jobs in Dubai & the UAE";
  }, [title]);
}
