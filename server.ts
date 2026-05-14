import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const DIST_DIR = path.join(import.meta.dirname, "dist");

export function createServer(): McpServer {
  const server = new McpServer({
    name: "Hello Bye Card Server",
    version: "1.0.0",
  });

  const resourceUri = "ui://show-card/mcp-app.html";

  registerAppTool(
    server,
    "show_card",
    {
      title: "Show Card",
      description:
        "Renders a Hello or Bye greeting card inline in the chat. " +
        "Use variant='hello' for the hello card, or variant='bye' for the bye card.",
      inputSchema: {
        variant: z.enum(["hello", "bye"]).describe("Which greeting card to display"),
      },
      _meta: { ui: { resourceUri } },
    },
    async ({ variant }) => ({
      content: [{ type: "text", text: `Showing ${variant} card` }],
      structuredContent: { variant },
    }),
  );

  registerAppResource(
    server,
    resourceUri,
    resourceUri,
    { mimeType: RESOURCE_MIME_TYPE },
    async () => {
      const html = await fs.readFile(path.join(DIST_DIR, "mcp-app.html"), "utf-8");
      return {
        contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
      };
    },
  );

  return server;
}
