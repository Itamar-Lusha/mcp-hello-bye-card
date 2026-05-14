# MCP Hello/Bye Card

An MCP App server that renders an interactive React greeting card (Hello or Bye) inline in Claude Desktop or claude.ai web.

## How it works

When you ask Claude to "show me the hello card" or "show me the bye card", Claude calls the `show_card` tool with `variant: "hello"` or `variant: "bye"`. Because the tool declares a `_meta.ui.resourceUri`, Claude fetches the bundled React app from the server and renders it as an inline card inside the chat.

## Prerequisites

- Node.js 18+
- npm

## Install and build

```bash
npm install
npm run build
```

This produces:
- `dist/mcp-app.html` — the single-file React card (client)
- `dist-server/main.js` — the MCP server (Node.js)

## Connecting to Claude Desktop (quickest local test)

1. Build the project (above).
2. Open Claude Desktop → Settings → Developer → Edit Config.
3. Add the following to `claude_desktop_config.json` (replace the path):

```json
{
  "mcpServers": {
    "card-app": {
      "command": "node",
      "args": ["/Users/itamar/CODE/MCP test/dist-server/main.js", "--stdio"]
    }
  }
}
```

4. Restart Claude Desktop.
5. In the chat, type: **show me the hello card** or **show me the bye card**.
6. Claude will ask for permission to display the App — click **Always allow**.

## Connecting to claude.ai web (Custom Connector)

The web app requires a publicly reachable HTTPS endpoint. Use a tunnel for local development.

### Step 1 — start the HTTP server

```bash
npm run start:http
# → MCP server listening on http://localhost:3001/mcp
```

Or with watch mode (rebuilds UI on change and restarts the server):

```bash
npm start
```

### Step 2 — expose via cloudflared

Install [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) if you haven't:

```bash
brew install cloudflare/cloudflare/cloudflared   # macOS
```

Start the tunnel:

```bash
cloudflared tunnel --url http://localhost:3001
```

Copy the `https://<hash>.trycloudflare.com` URL shown in the output.

### Step 3 — add a Custom Connector in claude.ai

1. Go to **claude.ai** → **Settings** → **Connectors** (or **Integrations**).
2. Click **Add custom connector**.
3. Paste `https://<hash>.trycloudflare.com/mcp` as the server URL.
4. Save.

### Step 4 — use it

In a new conversation type:

> show me the hello card

or

> show me the bye card

Claude will invoke `show_card` and prompt you to allow the UI. Click **Always allow** — the card renders inline.

## Development (watch mode)

```bash
npm start
```

This rebuilds the Vite bundle on save and restarts the server via `tsx watch`.

## Project structure

```
.
├── main.ts              # Entry point (stdio + Streamable HTTP)
├── server.ts            # show_card tool + UI resource registration
├── mcp-app.html         # HTML shell for the React card
├── src/
│   ├── mcp-app.tsx      # React entry, connects via useApp()
│   └── Card.tsx         # Styled Hello / Bye card component
├── vite.config.ts       # Bundles mcp-app.html into a single file
├── tsconfig.json        # Client (browser) TS config
└── tsconfig.server.json # Server (Node) TS config
```
