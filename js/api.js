let dollarToCzk, btcUsdPrice;

$.getJSON('https://cdn.moneyconvert.net/api/boa.json', function (res) {
  dollarToCzk = res.rates.CZK;
});

$.getJSON('https://blockchain.info/ticker', function (rate) {
  btcUsdPrice = rate.USD.last;
});

export {dollarToCzk, btcUsdPrice};
