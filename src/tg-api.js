import axios from "axios";

const rawTokens = process.env.TOKEN_ARRAY || "";
const tokens = rawTokens
  .replace(/^\[/, "")
  .replace(/\];?$/, "")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

let tokenIndex = 0;

export const tgGetUpdates = async (inputParams) => {
  const { offset } = inputParams;
  const token = tokens[tokenIndex];

  const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=30`;
  const data = await tgGetReq(url, { timeout: 35000 });

  const checkData = await checkToken(data);

  //if fucked run again
  if (!checkData) return await tgGetUpdates(inputParams);

  return data;
};

export const tgSendMessage = async (chatId, text) => {
  const token = tokens[tokenIndex];
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    });
  } catch (e) {
    console.log("sendMessage error:", e.response?.data || e.message);
  }
};

export const tgGetReq = async (url, config = {}) => {
  if (!url) return null;
  try {
    const res = await axios.get(url, config);
    return res.data;
  } catch (e) {
    console.log(e.response?.data || e.message);
    //axios throws error on 429, so need to return
    return e.response?.data || null;
  }
};

export const checkToken = async (data) => {
  if (data && data.ok) return true;

  if (data && data.error_code && data.error_code !== 429) return true;

  tokenIndex++;
  if (tokenIndex >= tokens.length) tokenIndex = 0;

  console.log("AHHHHHHHHHHHHH");
  console.log("CANT GET UPDATES TRYING NEW FUCKING BOT. TOKEN INDEX:" + tokenIndex);
  return null;
};
