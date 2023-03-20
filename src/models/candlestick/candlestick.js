class Candlestick {
    constructor({openPrice, highPrice, closePrice, lowPrice, timeframe, startTime = new Date(), volume}) {
        this.startTime = startTime;
        this.timeframe = timeframe;
        this.openPrice = openPrice;
        this.closePrice = closePrice;
        this.highPrice = highPrice;
        this.lowPrice = lowPrice;
        this.volume = volume || 0;
        this.state = closePrice ? "closed" : "open";
    }
    // Timestamp: '2021-12-23T00:34:00Z',
    // OpenPrice: 331.04,
    // HighPrice: 331.04,
    // LowPrice: 331,
    // ClosePrice: 331,
    // Volume: 2315,
    // TradeCount: 10,
    // VWAP: 331.003888
    average() {
        return (this.close + this.high + this.low) / 3;
    }
}

module.exports = exports = Candlestick;