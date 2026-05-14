import { useApp } from "@modelcontextprotocol/ext-apps/react";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Card } from "./Card.js";

type Variant = "hello" | "bye";

function CardApp() {
  const [variant, setVariant] = useState<Variant | null>(null);

  const { error } = useApp({
    appInfo: { name: "Hello Bye Card", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.ontoolinput = async (input) => {
        const v = input?.arguments?.variant as Variant | undefined;
        if (v === "hello" || v === "bye") setVariant(v);
      };

      app.ontoolresult = async (result) => {
        const v = (result as { structuredContent?: { variant?: unknown } })
          .structuredContent?.variant as Variant | undefined;
        if (v === "hello" || v === "bye") setVariant(v);
      };

      app.onerror = console.error;
    },
  });

  if (error) {
    return (
      <div style={{ padding: "16px", color: "#c0392b", fontFamily: "monospace" }}>
        Error: {error.message}
      </div>
    );
  }

  if (!variant) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "220px",
          color: "#888",
          fontSize: "16px",
        }}
      >
        Loading card…
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <Card variant={variant} />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CardApp />
  </StrictMode>,
);
