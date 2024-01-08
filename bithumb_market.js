const { XCoinAPI } = require("./XCoinAPI.js");
const fs = require("fs");

const api_key = fs.readFileSync("./api_key.txt", "utf8");
const api_secret = fs.readFileSync("./api_secret.txt", "utf8");
const krw_amount = fs.readFileSync("./krw_amount.txt", "utf8");
const krw_target_volume = fs.readFileSync("./krw_target_volume.txt", "utf8");
const order_currency = fs.readFileSync("./order_currency.txt", "utf8");
const payment_currency = fs.readFileSync("./payment_currency.txt", "utf8");

const bithumb = new XCoinAPI(api_key, api_secret);

let btcPrice = 0;
const calculateUnits = async () => {
  const data = await bithumb.xcoinApiCall("/public/ticker/" + order_currency + "_" + payment_currency);
  const parsed = JSON.parse(data.body);

  const currentPrice = parsed.data.closing_price;
  btcPrice = Number(currentPrice);

  const desiredUnits = Math.floor((krw_amount / currentPrice) * 10000) / 10000;
  return desiredUnits.toFixed(4);
};

let btcBuyVolume = 0;
let btcSellVolume = 0;
const buy = async (params) => {
  try {
    await bithumb.xcoinApiCall("/trade/market_buy", params);

    btcBuyVolume += Number(params.units);
  } catch (e) {
    // retry
    await bithumb.xcoinApiCall("/trade/market_buy", params);
    btcBuyVolume += Number(params.units);
  }
};

const sell = async (params) => {
  try {
    await bithumb.xcoinApiCall("/trade/market_sell", params);
    btcSellVolume += Number(params.units);
  } catch (e) {
    // retry
    await bithumb.xcoinApiCall("/trade/market_sell", params);
    btcSellVolume += Number(params.units);
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
      }
    } catch (e) {
      console.log("sell failed");
    } finally {
      if (i % 50 === 0) {
        const table = {
          "총 거래량": numberToKorean((btcBuyVolume + btcSellVolume) * btcPrice) + "원",
          "매수 거래량": numberToKorean(btcBuyVolume * btcPrice) + "원",
          "매도 거래량": numberToKorean(btcSellVolume * btcPrice) + "원",
          "총 반복 횟수": i,
        };

        console.table(table);
      }
    }
  }

  const endTime = new Date().getTime();

  console.log("소요시간", (endTime - startTime) / 1000, "초");
  const table = {
    "총 거래량": (btcBuyVolume + btcSellVolume) * btcPrice,
    "매수 거래량": btcBuyVolume * btcPrice,
    "매도 거래량": btcSellVolume * btcPrice,
  };

  console.table(table);
  cleanUp();
}

function numberToKorean(number) {
  var inputNumber = number < 0 ? false : number;
  var unitWords = ["", "만", "억", "조", "경"];
  var splitUnit = 10000;
  var splitCount = unitWords.length;
  var resultArray = [];
  var resultString = "";

  for (var i = 0; i < splitCount; i++) {
    var unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
    unitResult = Math.floor(unitResult);
    if (unitResult > 0) {
      resultArray[i] = unitResult;
    }
  }

  for (var i = 0; i < resultArray.length; i++) {
    if (!resultArray[i]) continue;
    resultString = String(resultArray[i]) + unitWords[i] + resultString;
  }

  return resultString;
}
module.exports = {
  startBithumbMarket,
  cleanUp,
};
