const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");

process.env.NTBA_FIX_319 = 1;

const token = "1423055464:AAGkEeD8xwKcuWZg4hZ68Ko1MgGiK7V0MBs";
const bot = new TelegramBot(token, {
  polling: true,
  webHook: process.env.PORT,
});

const getHTMLMessage = symbols => {
  let htmlMessage = `
<b>${symbols[0].symbol}</b> - <code>${(+symbols[0].price).toFixed(4)}$</code>
<b>${symbols[1].symbol}</b> - <code>${(+symbols[1].price).toFixed(4)}$</code>
<b>${symbols[2].symbol}</b> - <code>${(+symbols[2].price).toFixed(4)}$</code>
      `;

    return htmlMessage;
};


bot.on("message", msg => {
  let interval;

  if (msg.chat.id) {
    interval = setInterval(async () => {
      let response = await fetch("https://api.binance.com/api/v3/ticker/price");
  
      if (response.ok) {
        let json = await response.json();
  
        let symbols = json.filter(symbol => {
          if (symbol.symbol == "ETHUSDT" || symbol.symbol == "BTCUSDT" || symbol.symbol == "BNBUSDT") {
            return true;
          }
        });
  
        let htmlMessage = getHTMLMessage(symbols);
  
        if (msg.chat.id) {
          bot.sendMessage(msg.chat.id, htmlMessage, {
            "parse_mode": "HTML"
          });
        } else {
          clearInterval(interval);
        }
      }
    }, 5000);
  }
  else {
    clearInterval(interval);
  }
});