"use client";

import { useEffect } from "react";
import { OverlayScrollbars } from "overlayscrollbars";

export default function OverlayScrollbarInit() {
  useEffect(() => {
    const instance = OverlayScrollbars(document.body, {
      scrollbars: {
        theme: "os-theme-dark",
        visibility: "visible",
        autoHide: "never",
        dragScroll: true,
        clickScroll: true,
      },
      overflow: {
        x: "hidden",
      },
    });

    return () => {
      instance?.destroy();
    };
  }, []);

  return null;
}
