import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const DEFAULT_SYSTEM = "You are a helpful assistant on Telegram. Be concise and direct in your responses.";

export const askClaude = async (messages) => {
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: process.env.SYSTEM_PROMPT || DEFAULT_SYSTEM,
      messages,
    });

    return response.content[0].text;
  } catch (e) {
    console.log("Claude API error:", e.message);
    return null;
  }
};
