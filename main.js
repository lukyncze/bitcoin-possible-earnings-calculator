const btcData = [
    { year: '2014', worth: [862.24, 685.65, 562.38, 446.29, 526.32, 616.97, 609.04, 528.16, 432.56, 360.69, 374.65, 346.03] },
    { year: '2015', worth: [246.56, 237.21, 269.54, 239.88, 236.82, 242.97, 283.14, 247.85, 235.35, 282.65, 361.32, 412.25] },
    { year: '2016', worth: [411.19, 404.37, 417.84, 442.02, 486.28, 651.61, 664.19, 576.87, 599.31, 662.34, 720.16, 866.34] },
    { year: '2017', worth: [966.24, 1084.32, 1106.25, 1214.19, 1932.62, 2682.99, 2402.58, 3707.03, 4023.48, 5348.88, 8091.83, 15236.50] },
    { year: '2018', worth: [13816.65, 9179.48, 9231.91, 8166.91, 8497.07, 6811.84, 7326.54, 6904.81, 6793.82, 6467.31, 5208.27, 3705.78] },
    { year: '2019', worth: [3713.00, 3750.79, 3907.89, 4832.66, 7079.11, 10429.67, 11013.46, 10750.54, 9327.91, 8472.29, 8146.94, 7077.40] },
    { year: '2020', worth: [8239.06, 9439.63, 6948.27, 7695.75, 9291.51, 9603.39, 10196.31, 11669.15, 11024.95, 12169.55, 16611.05, 23487.00] },
];
const months = ['lednu','únoru','březnu','dubnu','květnu','červnu','červenci','srpnu','září','říjnu','listopadu','prosinci'];
const dolarCzkWorth = 21.9009;
var currentPriceBTC;

$.getJSON('https://api.coindesk.com/v1/bpi/currentprice.json', function(rate) {
    currentPriceBTC=rate.bpi.USD.rate_float;
    var CZK = (currentPriceBTC*dolarCzkWorth).toFixed(0);
    var text = `Aktuální hodnota BTC: $${currentPriceBTC.toFixed(2)} (${CZK} Kč)`
    $("#valueBtc").html(text);
});

$(function(){
    let BTC = {
        year: '2014',
        month: '0',
        deposit: 21900/dolarCzkWorth,
        worth: 862.24,
        part: function(){
            let btcValue = btcData.find(obj => obj.year === this.year);
            let btcPart = (this.deposit/dolarCzkWorth) / (btcValue.worth[this.month]);
            //console.log(btcPart); // jakou část BTC vlastníme po depositu
            return (btcPart);
        },
        value: function(){
            let btcPart = this.part();
            let btcVal = btcPart*currentPriceBTC*dolarCzkWorth;
            console.log(btcVal);
            return (btcVal.toFixed(0));
        },
    }

    //console.log(BTC.value());

    $("#calc").on("click", function(){
        BTC.deposit = $("#deposit").val();
        BTC.month = $("#month").val();
        BTC.year = $("#year").val();
        valBtc = BTC.part().toFixed(8);
        month = months[$("#month").val()];
        percent = (BTC.value()/BTC.deposit).toFixed(0);
        function lastCall(percent) {
            if(percent<5){
                return 'O Bitcoinu ses dozvěděl až včera?';
            }
            else if(percent<15){
                return 'Takový profit už jde co? :)';
            }
            else if(percent<50){
                return 'To už je pěkný zisk ;)';
            }
            else if(percent<100){
                return 'Toto se jen tak někomu nepovede, gratuluji!';
            }
            return 'Ty musíš být opravdu bohatý!';
        }
        
        result = $("#result").html(`Kdybys investoval do Bitcoinu ${BTC.deposit} Kč v ${month} ${BTC.year}, nyní by jsi měl <strong>${BTC.value()} Kč</strong> v Bitcoinu (${valBtc} BTC).<br>
        Za předpokladu že bys tehdy investoval, vloženou částku bys znásobil <strong>${percent}x</strong>!<br>`);
        result2 = $("#lastCall").html(`<strong>${lastCall(percent)}</strong>`);
    });
});