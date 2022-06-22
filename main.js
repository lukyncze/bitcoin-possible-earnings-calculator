const btcData = [
  {year: '2014', worth: [862.24, 685.65, 562.38, 446.29, 526.32, 616.97, 609.04, 528.16, 432.56, 360.69, 374.65, 346.03]},
  {year: '2015', worth: [246.56, 237.21, 269.54, 239.88, 236.82, 242.97, 283.14, 247.85, 235.35, 282.65, 361.32, 412.25]},
  {year: '2016', worth: [411.19, 404.37, 417.84, 442.02, 486.28, 651.61, 664.19, 576.87, 599.31, 662.34, 720.16, 866.34]},
  {year: '2017', worth: [966.24, 1084.32, 1106.25, 1214.19, 1932.62, 2682.99, 2402.58, 3707.03, 4023.48, 5348.88, 8091.83, 15236.5]},
  {year: '2018', worth: [13816.65, 9179.48, 9231.91, 8166.91, 8497.07, 6811.84, 7326.54, 6904.81, 6793.82, 6467.31, 5208.27, 3705.78]},
  {year: '2019', worth: [3713.0, 3750.79, 3907.89, 4832.66, 7079.11, 10429.67, 11013.46, 10750.54, 9327.91, 8472.29, 8146.94, 7077.4]},
  {year: '2020', worth: [8239.06, 9439.63, 6948.27, 7695.75, 9291.51, 9603.39, 10196.31, 11669.15, 11024.95, 12169.55, 16611.05, 23487.0]},
];
const months = ['lednu', 'únoru', 'březnu', 'dubnu', 'květnu', 'červnu', 'červenci', 'srpnu', 'září', 'říjnu', 'listopadu', 'prosinci'];
let dollarCzkWorth, currentPriceBtcUSD;

$.getJSON('https://cdn.moneyconvert.net/api/boa.json', function (res) {
  dollarCzkWorth = res.rates.CZK;
});

$.getJSON('https://blockchain.info/ticker', function (rate) {
  currentPriceBtcUSD = rate.USD.last;
});

$(function () {
  let BTC = {
    year: '2014',
    month: '0',
    deposit: 21900 / dollarCzkWorth,
    worth: 862.24,
    part: function () {
      // jakou část BTC vlastníme po depositu
      let btcValue = btcData.find(obj => obj.year === this.year);
      let btcPart = this.deposit / dollarCzkWorth / btcValue.worth[this.month];
      return btcPart;
    },
    estate: function () {
      // jmění v KČ
      let btcPart = this.part();
      let estate = (btcPart * currentPriceBtcUSD * dollarCzkWorth).toFixed(0);
      return estate;
    },
    percent: function () {
      let percent = (this.estate() / this.deposit).toFixed(0);
      return percent;
    },
    result: function () {
      let percent = this.percent();
      if (percent < 5) {
        return 'O Bitcoinu ses dozvěděl až včera?';
      } else if (percent < 15) {
        return 'Takový profit už jde co? :)';
      } else if (percent < 50) {
        return 'To už je pěkný zisk ;)';
      } else if (percent < 100) {
        return 'Toto se jen tak někomu nepovede, gratuluji!';
      }
      return 'Ty musíš být opravdu bohatý!';
    },
  };

  $('#calc').on('click', function () {
    BTC.deposit = $('#deposit').val();
    BTC.month = $('#month').val();
    BTC.year = $('#year').val();

    btcCzkVal = (currentPriceBtcUSD * dollarCzkWorth).toFixed(0);
    month = months[$('#month').val()];

    result = $('#result').html(`Kdybys investoval do Bitcoinu ${BTC.deposit} Kč v ${month} ${BTC.year},
        nyní by jsi měl <strong>${BTC.estate()} Kč</strong> v Bitcoinu (${BTC.part().toFixed(8)} BTC).<br>
        Za předpokladu že bys tehdy investoval, vloženou částku bys znásobil <strong>${BTC.percent()}x</strong> (bez zdanění zisku)!<br>`);
    hr = $('.hr').html(`<hr>`);
    lastCall = $('#lastCall').html(`<strong>${BTC.result()}</strong>`);
    valueBtc = $('#valueBtc').html(`Aktuální hodnota BTC: $${currentPriceBtcUSD.toFixed(2)} (${btcCzkVal} Kč)`);
    czkToDollar = $('#czkToDollar').html(`Aktuální kurz: $1 = ${dollarCzkWorth.toFixed(4)} Kč`);
  });
});
