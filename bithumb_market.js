const { XCoinAPI } = require("./XCoinAPI.js");
const fs = require("fs");

const api_key = fs.readFileSync("./api_key.txt", "utf8");
const api_secret = fs.readFileSync("./api_secret.txt", "utf8");
const krw_amount = fs.readFileSync("./krw_amount.txt", "utf8");
const krw_target_volume = fs.readFileSync("./krw_target_volume.txt", "utf8");
const order_currency = fs.readFileSync("./order_currency.txt", "utf8");
const payment_currency = fs.readFileSync("./payment_currency.txt", "utf8");

const bithumb = new XCoinAPI(api_key, api_secret);

const calculateUnits = async () => {
  const data = await bithumb.xcoinApiCall("/public/ticker/" + order_currency + "_" + payment_currency);
  const parsed = JSON.parse(data.body);

  const currentPrice = parsed.data.closing_price;

  const desiredUnits = Math.floor((krw_amount / currentPrice) * 10000) / 10000;
  return desiredUnits.toFixed(4);
};

const buy = async (params) => {
  try {
    await bithumb.xcoinApiCall("/trade/market_buy", params);
    console.log("buy success");
  } catch (e) {
    // retry
    await bithumb.xcoinApiCall("/trade/market_buy", params);
    console.log("buy success");
  }
};

const sell = async (params) => {
  try {
    await bithumb.xcoinApiCall("/trade/market_sell", params);
    console.log("sell success");
  } catch (e) {
    // retry
    await bithumb.xcoinApiCall("/trade/market_sell", params);
    console.log("sell success");
  }
};

const cleanUp = async () => {
  console.log("cleaning up", order_currency);
  const current = await bithumb.xcoinApiCall("/info/balance", {
    currency: order_currency,
  });
  const param = {
    units: (Math.floor(JSON.parse(current.body).data.total_btc * 10000) / 10000).toString(),
    order_currency,
    payment_currency,
  };

  await sell(param);
};

let startTime = new Date().getTime();
async function startBithumbMarket() {
  const units = await calculateUnits();

  const params = {
    units: units,
    order_currency,
    payment_currency,
  };

  const loopLength = Math.floor(krw_target_volume / krw_amount) / 2;

  for (let i = 0; i < loopLength; i++) {
    console.log("loop", i);
    try {
      await buy(params);
    } catch (e) {
      console.log("buy failed");
    }
    try {
      await sell(params);

      if (i % 5 === 0) {
        // just in case we missed a sell
        await sell(params);
        console.log("sell twice");
      }
    } catch (e) {
      console.log("sell failed");
    }
  }

  const endTime = new Date().getTime();

  console.log("total time", (endTime - startTime) / 1000, "seconds");
  cleanUp();
}
module.exports = {
  startBithumbMarket,
  cleanUp,
};
