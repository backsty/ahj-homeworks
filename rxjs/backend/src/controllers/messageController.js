import { generateMessages } from "../utils/messageGenerator.js";

export const getUnreadMessages = (req, res) => {
  // const count = Math.floor(Math.random() * 4) + 1;
  const messages = generateMessages();

  console.log("\x1b[36m%s\x1b[0m", "[Server] Отправка сообщений:", messages);

  res.json({
    status: "ok",
    timestamp: Date.now(),
    messages,
  });
};
