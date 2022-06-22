import data from './btcData.js';
import {dollarToCzk, btcUsdPrice} from './api.js';

const months = ['lednu', 'únoru', 'březnu', 'dubnu', 'květnu', 'červnu', 'červenci', 'srpnu', 'září', 'říjnu', 'listopadu', 'prosinci'];

$(function () {
  const CalcBtc = {
    year: '2014',
    month: '0',
    deposit: 21900 / dollarToCzk,
    worth: 862.24,
    part() {
      let btcValue = data.find(obj => obj.year === this.year);
      return this.deposit / dollarToCzk / btcValue.worth[this.month];
    },
    estate() {
      let btcPart = this.part();
      return (btcPart * btcUsdPrice * dollarToCzk).toFixed(0);
    },
    percent() {
      return (this.estate() / this.deposit).toFixed(0);
    },
    result() {
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
    dataFromApiNotReached() {
      const apiData = [dollarToCzk, btcUsdPrice];
      return apiData.includes(undefined);
    },
  };

  $('#calc').on('click', function () {
    if (CalcBtc.dataFromApiNotReached()) return $('#result').html(`Nepodařilo se dostat data z API.<br>Nahlaste tuto chybu prosím Lukášovi, díky :)`);

    CalcBtc.deposit = $('#deposit').val();
    CalcBtc.month = $('#month').val();
    CalcBtc.year = $('#year').val();

    const btcCzkVal = (btcUsdPrice * dollarToCzk).toFixed(0);
    const depositMonth = months[$('#month').val()];

    $('#result').html(`Kdybys investoval do Bitcoinu ${CalcBtc.deposit} Kč v ${depositMonth} ${CalcBtc.year},
        nyní by jsi měl <strong>${CalcBtc.estate()} Kč</strong> v Bitcoinu (${CalcBtc.part().toFixed(8)} CalcBtc).<br>
        Za předpokladu že bys tehdy investoval, vloženou částku bys znásobil <strong>${CalcBtc.percent()}x</strong> (bez zdanění zisku)!<br>`);
    $('.hr').html(`<hr>`);
    $('#lastCall').html(`<strong>${CalcBtc.result()}</strong>`);
    $('#valueBtc').html(`Aktuální hodnota CalcBtc: $${btcUsdPrice.toFixed(2)} (${btcCzkVal} Kč)`);
    $('#czkToDollar').html(`Aktuální kurz: $1 = ${dollarToCzk.toFixed(4)} Kč`);
  });
});
