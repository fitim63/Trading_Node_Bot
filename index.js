require('dotenv').config();
const Alpaca = require('@alpacahq/alpaca-trade-api');
const program = require('commander');
const Historical = require('./src/historical');
const Backtester = require('./src/backtester');


//Dates should be in an interval where the stock market is open!!
const now = new Date();
console.log("now: ", now);
// const OneHourFromNow = new Date();
const OneHourFromNow = new Date(now.getTime() - (5 * 60 * 60 * 1000));
console.log(OneHourFromNow);
const yesterday = new Date(OneHourFromNow.getTime() - (24 * 60 * 60 * 1000));
console.log(yesterday);


function toDate(val) {
    return new Date(val * 1e3);
}

program.version('1.0.0')
    .option('-t, --timeframe [timeframe]', 'timeframe in hours for candlestick', parseInt, "23Hour")
    .option('-p, --product [product]', 'Product Indentifier', 'TSLA')
    .option('-s, --start [start]', 'Start Time in Unix Seconds', toDate, yesterday)
    .option('-e, --end [end]', 'End Time in Unix Seconds', toDate, OneHourFromNow)
    .parse(process.argv);

const main = async function () {
    const {timeframe, start, end, product} = program;

    const tester = new Backtester({
        start, end, product, timeframe
    });

    await tester.start()
};

main();