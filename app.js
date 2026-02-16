import "dotenv/config";
import { tgGetUpdates, tgSendMessage } from "./src/tg-api.js";
import { askClaude } from "./src/claude-api.js";

const MAX_HISTORY = 20;
const MAX_MSG_LENGTH = 4096;

const conversations = new Map();

const commandRegex = /^\/claude(?:@\w+)?\s+([\s\S]+)/;

const parseCommand = (text) => {
  if (!text) return null;
  const match = text.match(commandRegex);
  return match ? match[1].trim() : null;
};

const getHistory = (chatId) => {
  if (!conversations.has(chatId)) {
    conversations.set(chatId, []);
  }
  return conversations.get(chatId);
};

const addToHistory = (chatId, role, content) => {
  const history = getHistory(chatId);
  history.push({ role, content });

  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }
};

const handleUpdate = async (update) => {
  const message = update.message;
  if (!message || !message.text) return;

  const chatId = message.chat.id;
  const userText = parseCommand(message.text);
  if (!userText) return;

  addToHistory(chatId, "user", userText);

  const history = getHistory(chatId);
  const reply = await askClaude(history);

  if (!reply) {
    await tgSendMessage(chatId, "Sorry, I could not generate a response.");
    return;
  }

  addToHistory(chatId, "assistant", reply);

  const truncated = reply.length > MAX_MSG_LENGTH
    ? reply.slice(0, MAX_MSG_LENGTH - 3) + "..."
    : reply;

  await tgSendMessage(chatId, truncated);
};

const poll = async () => {
  let offset = 0;

  console.log("Bot started. Polling for updates...");

  while (true) {
    try {
      const data = await tgGetUpdates({ offset });

      if (data && data.result) {
        for (const update of data.result) {
          await handleUpdate(update);
          offset = update.update_id + 1;
        }
      }
    } catch (e) {
      console.log("Polling error:", e.message);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
};

poll();
