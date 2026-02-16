import axios from "axios";

let tokenIndex = 0;

export const tgGetUpdates = async (inputParams) => {
  const { offset } = inputParams;
  const token = process.env.TOKEN_ARRAY[tokenIndex];

  const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}`;
  const data = await tgGetReq(url);

  const checkData = await checkToken(data);

  //if fucked run again
  if (!checkData) return await tgGetUpdates(inputParams);

  return data;
};

export const tgGetReq = async (url) => {
  if (!url) return null;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    console.log(e.response.data);
    //axios throws error on 429, so need to return
    return e.response.data;
  }
};

export const checkToken = async (data) => {
  if (data && data.ok) return true;

  if (data && data.error_code && data.error_code !== 429) return true;

  tokenIndex++;
  if (tokenIndex > 10) tokenIndex = 0;

  console.log("AHHHHHHHHHHHHH");
  console.log("CANT GET UPDATES TRYING NEW FUCKING BOT. TOKEN INDEX:" + tokenIndex);
  return null;
};
