const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/bot.js")) {
    const queryObject = url.parse(req.url, true).query;
    const filePath = path.join(__dirname, "./chatbot/bot.js");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      // Chèn các tham số vào tệp bot.js
      const title = queryObject.title;
      const subtitle = queryObject.subtitle;
      const webhookUrl = queryObject.webhookUrl;
      const welcomeBot = queryObject.welcomeBot;
      const messageBot = queryObject.messageBot;
      const phoneNumbers = queryObject.phoneNumbers;
      const tokens = queryObject.tokens;
      const emailAdmin = queryObject.emailAdmin;
      const merchantId = queryObject.merchantId;
      const secretKey = queryObject.secretKey;
      const merchantKey = queryObject.merchantKey;
      const userId = queryObject.userId;
      const platform = queryObject.platform;
      data = data.replace(/config\.title/g, `"${title}"`);
      data = data.replace(/config\.subtitle/g, `"${subtitle}"`);
      data = data.replace(/config\.webhookUrl/g, `"${webhookUrl}"`);
      data = data.replace(/config\.welcomeBot/g, `"${welcomeBot}"`);
      data = data.replace(/config\.messageBot/g, `"${messageBot}"`);
      data = data.replace(/config\.phoneNumbers/g, `"${phoneNumbers}"`);
      data = data.replace(/config\.tokens/g, `"${tokens}"`);
      data = data.replace(/config\.emailAdmin/g, `"${emailAdmin}"`);
      data = data.replace(/config\.merchantId/g, `"${merchantId}"`);
      data = data.replace(/config\.secretKey/g, `"${secretKey}"`);
      data = data.replace(/config\.merchantKey/g, `"${merchantKey}"`);
      data = data.replace(/config\.userId/g, `"${userId}"`);
      data = data.replace(/config\.platform/g, `"${platform}"`);
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(data);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
