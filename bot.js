const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");

const token = "1423055464:AAH-3QX7eKq_eSAxRJ9VhPLRj1Lumq-INXQ";
const bot = new TelegramBot(token, {
  polling: true,
  webHook: process.env.PORT,
});

bot.on("message", async (msg) => {
  let interval = setInterval(async () => {
    let response = await fetch("https://api.binance.com/api/v3/ticker/price");

    if (response.ok) {
      let json = await response.json();

      let symbols = json.filter(symbol => {
        if (symbol.symbol == "ETHUSDT" || symbol.symbol == "BTCUSDT" || symbol.symbol == "BNBUSDT") {
          return true;
        }
      });

      let date = new Date();
      let options = new Intl.DateTimeFormat("ru", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      });

      let html = `
<b>${symbols[0].symbol}</b> - <code>${(+symbols[0].price).toFixed(4)}$</code>
<b>${symbols[1].symbol}</b> - <code>${(+symbols[1].price).toFixed(4)}$</code>
<b>${symbols[2].symbol}</b> - <code>${(+symbols[2].price).toFixed(4)}$</code>
      `;

      if (msg.chat.id) {
        bot.sendMessage(msg.chat.id, html, {
          "parse_mode": "HTML"
        });
      }
    } else {
      console.log("error")
    }
  }, 30000);
});