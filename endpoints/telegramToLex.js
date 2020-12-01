const AWS = require("aws-sdk");
const { response } = require("../common/http");
const axios = require("axios");


const lexruntime = new AWS.LexRuntime();

module.exports.telegram = async (event) => {
  try {
    const body = JSON.parse(event.body);
    console.log(body);

    const messageForLex = mapTelegramToLex(body);
    const lexResponse = await lexruntime.postText(messageForLex).promise();

    const messageForTelegram = mapLexToTelegram(lexResponse, body);
    await sendToTelegram(messageForTelegram);

    return response._200();
  } catch (err) {
    console.log("error ===== ", err.message);
    return response._500();
  }
};

const mapTelegramToLex = (body) => {
  const chatId = String(body.message.chat.id);
  const message = body.message.text;

  return {
    inputText: message,
    userId: chatId,
    botName: "telegramBot",
    botAlias: "dev",
    sessionAttributes: {},
  };
};

const mapLexToTelegram = (lexResponse,body) => {
  return {
    text: lexResponse.message,
    chat_id: body.message.chat.id,
  };
};

const sendToTelegram = (message) => {
  const token = process.env.apptoken
  const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`

  return axios.post(telegramUrl,message)
};