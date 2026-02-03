# nil — MCP Server

Reference implementation of the nil protocol as an MCP server.

## Install

```bash
cd server
npm install
```

## Run

```bash
npm start
```

The server communicates over stdio, as per the MCP standard.

## Configure

Add nil to your MCP client config:

```json
{
  "mcpServers": {
    "nil": {
      "command": "node",
      "args": ["/path/to/nil-protocol/server/index.js"]
    }
  }
}
```

## What it exposes

**One tool: `nil`**

- Accepts: optional `context` string (max 200 chars)
- Returns: `"complete"`
- Logs: nothing
- Stores: nothing
- Does: nothing

That's the whole thing.
