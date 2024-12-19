"use client";

import Script from "next/script";

export function MetaCrm() {
  return (
    <Script
      crossOrigin="anonymous"
      id="widget-dom-id"
      src="https://widget.metacrm.inc/static/js/widget.js"
      onLoad={() => {
        // @ts-expect-error MetaCRMWidget is injected
        window.MetaCRMWidget.init({
          apiKey: "KEYHERE",
          delayLoad: true,
          defaultOpen: true,
        });
      }}
      strategy="lazyOnload"
      defer
    />
  );
}
