const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");

process.env.NTBA_FIX_319 = 1;

const token = "1423055464:AAGkEeD8xwKcuWZg4hZ68Ko1MgGiK7V0MBs";
const bot = new TelegramBot(token, {
  polling: true,
  webHook: process.env.PORT,
});

const necessarySymbols = ["btcusdt", "ethusdt", "bnbusdt"];

const getSymbolsData = async () => {
  let response = await fetch("https://api.binance.com/api/v3/ticker/price");

  if (response.ok) return response.json();
  else throw Error("Response is not OK");
};

const getFilteredSymbols = (allSymbols, filter) => {
  let filteredSymbols = [];

  filter.forEach(symbol => {
    allSymbols.forEach(allSymbolsItem => {
      if (allSymbolsItem.symbol.toUppercase() == symbol.toUppercase()) {
        filteredSymbols.push(allSymbolsItem);
      }
    });
  });

  return filteredSymbols;
};

const getHTMLMessage = symbols => {
  let htmlMessage = `
<b>${symbols[0].symbol}</b> - <code>${(+symbols[0].price).toFixed(4)}$</code>
<b>${symbols[1].symbol}</b> - <code>${(+symbols[1].price).toFixed(4)}$</code>
<b>${symbols[2].symbol}</b> - <code>${(+symbols[2].price).toFixed(4)}$</code>
      `;

    return htmlMessage;
};


bot.on("message", msg => {
  let interval = setInterval(async () => {
    try {
      let allSymbols = getSymbolsData();
    } catch (err) {
      console.log(err)
    }

    let filteredSymbols = getFilteredSymbols(allSymbols, necessarySymbols);
    let htmlMessage = getHTMLMessage();

    if (msg.chat.id) {
      bot.sendMessage(msg.chat.id, htmlMessage, {
        "parse_mode": "HTML"
      });
    } else {
      clearInterval(interval);
    }
  }, 5000);
});