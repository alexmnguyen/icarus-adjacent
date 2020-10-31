require("dotenv").config();
const mockResponse = require("./mocks/ameritradechain.json");
const { DateTime } = require("luxon");
const axios = require("axios");
const Tradier = require("tradier-api");

const tradier = new Tradier(process.env.TRADIER_API_KEY, "prod");

const dte = 0;

function round5(x) {
  return x % 5 >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}

const getSPXQuote = async () => {
  const res = await axios.get(
    "https://api.tdameritrade.com/v1/marketdata/$SPX.X/quotes",
    {
      params: { apikey: process.env.TOS_API_KEY },
    }
  );

  return res.data["$SPX.X"].lastPrice;
};

const getClosestStrikeToUnderlying = async () => {
  const underlyingQuote = await getSPXQuote();
  console.log("SPX Quote: ", underlyingQuote);

  return round5(underlyingQuote);
};

const getContractsForStrike = async (strike) => {
  const res = await tradier.getOptionChains("SPX", "2020-11-02");
  const chain = res.option;
  return chain.filter((contract) => contract.strike === strike);
};

const getExpectedMove = async () => {
  const strikeClosestToUnderlying = await getClosestStrikeToUnderlying();
  console.log("Closest strike: ", strikeClosestToUnderlying);

  const contracts = await getContractsForStrike(strikeClosestToUnderlying);
  //console.log("contracts", contracts);

  const bidSum = contracts[0].bid + contracts[1].bid;
  const askSum = contracts[0].ask + contracts[1].ask;
  const em = bidSum / 2 + askSum / 2;

  return em;
};

module.exports = {
  getExpectedMove,
};
