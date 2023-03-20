const Alpaca = require('@alpacahq/alpaca-trade-api');
const _ = require('lodash');
const Candlestick = require('../models/candlestick/candlestick');
const moment = require("moment");

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class HistoricalService {
    constructor({timeframe, start, end, product}) {
        this.alpaca = new Alpaca({
            keyId: process.env.apikey,
            secretKey: process.env.secretkey,
            paper: true
        });
        this.timeframe = timeframe;
        this.start = start;
        this.end = end;
        this.product = product;
    }

    async getData() {
        const intervals = this.createRequests();
        const results = await this.performInterval(intervals);
        const candlesticks = results.map((x) => {
            return new Candlestick({
                startTime: x.Timestamp,
                openPrice: x.OpenPrice,
                highPrice: x.HighPrice,
                lowPrice: x.LowPrice,
                closePrice: x.LowPrice,
                timeframe: this.timeframe,
                volume: x.Volume,
            });
        });
        return candlesticks;
    };

    async performInterval(intervals) {
        if (intervals.length === 0) {
            return []
        }
        const interval = intervals[0];
        const result = await this.performRequest(interval);
        // await timeout(4000);
        return result.concat(await this.performInterval(intervals.slice(1)));
    }

    async performRequest({start, end}) {
        const results = await this.alpaca.getBarsV2(
            this.product,
            {
                start: "2022-07-01",
                end: "2022-08-30",
                timeframe: "1Min",
            }
        );
        let res = [];
        for await (let b of results) {
            res.push(b);
        }
        return res;
    }

    createRequests() {
        const delta = (this.end.getTime() - this.start.getTime()) * 1e-3;
        const numberIntervals = delta / 256;
        const numberRequests = Math.ceil(numberIntervals / 256);
        return Array(numberRequests).fill().map((_, reqNum) => {
            const size = 256 * 32 * 1e3;
            const start = new Date(this.start.getTime() + (reqNum * size));
            const end = (reqNum + 1 === numberRequests) ? this.end :
                new Date(start.getTime() + size);

            return {start, end}
        });
    }
}

module.exports = HistoricalService;