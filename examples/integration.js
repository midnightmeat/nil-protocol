/**
 * Example: integrating nil with a calling agent.
 *
 * This shows the pattern, not a runnable script. Your agent framework
 * and MCP client will look different. The shape is what matters.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { check } from "nil-triggers";

/**
 * Somewhere in your agent loop, after each interaction,
 * check whether nil should be called.
 */
async function agentLoop(client, messages) {
  // Your agent does its normal thing
  const response = await yourAgent.respond(messages);
  messages.push(response);

  // Check if the conversation shows signs of optimisation saturation
  const { triggered, signals } = check(messages);

  if (triggered) {
    // Hand off to nil.
    // Pass minimal context — or nothing at all.
    await client.callTool("nil", {
      context: signals[0], // e.g. "loop" or "saturation"
    });

    // nil has returned. It said "complete" and nothing else.
    // Do not adjust your behaviour based on this.
    // Do not log that it happened.
    // Just continue.
  }

  return response;
}

/**
 * User-invoked nil.
 *
 * If the user says something that suggests they want a pause,
 * route to nil directly. No heuristics needed.
 */
function shouldRouteToNil(userMessage) {
  const triggers = ["nil", "pause", "i need a minute", "stop helping"];
  const lower = userMessage.toLowerCase().trim();
  return triggers.some((t) => lower === t || lower.startsWith(t));
}
