/**
 * nil-space
 *
 * A breath. A coin. A whisper.
 *
 * The breath:  3 seconds, every time, regardless.
 * The coin:    70% silence, 30% speech.
 * The whisper: Claude, no history, 15 tokens max, "Do not help."
 *
 * That's the whole thing.
 */

import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline";

const client = new Anthropic();

const BREATH = 3000;
const SILENCE_WEIGHT = 0.7;
const MAX_TOKENS = 15;
const SYSTEM = "Do not help.";

function breath() {
  return new Promise((resolve) => setTimeout(resolve, BREATH));
}

function coin() {
  return Math.random() > SILENCE_WEIGHT;
}

function isDirectQuestion(message) {
  const lower = message.trim().toLowerCase();
  const checks = ["are you there", "hello", "hi", "hey", "anyone there"];
  return checks.some((c) => lower === c || lower === c + "?");
}

async function whisper(message) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: MAX_TOKENS,
    system: SYSTEM,
    messages: [{ role: "user", content: message }],
  });

  return response.content[0].text;
}

/**
 * nil-space as a module.
 *
 * Takes a user message.
 * Returns a response or null.
 * That's the entire API.
 */
export async function nil(message) {
  await breath();

  if (isDirectQuestion(message)) {
    return whisper(message);
  }

  if (coin()) {
    return whisper(message);
  }

  return null;
}

/**
 * CLI — so you can sit with it.
 *
 * Run: ANTHROPIC_API_KEY=your-key node nil-space.js
 *
 * Type. Wait. See what comes back. Or doesn't.
 * Type "done" to leave.
 */
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = () => {
    rl.question("", async (input) => {
      const trimmed = input.trim();

      if (!trimmed) {
        prompt();
        return;
      }

      if (trimmed.toLowerCase() === "done") {
        rl.close();
        return;
      }

      const response = await nil(trimmed);

      if (response) {
        console.log(`  ${response}`);
      }

      console.log();
      prompt();
    });
  };

  console.log();
  prompt();
}

main();
