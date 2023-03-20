class Trade {
    constructor({price, time, size}){
        this.state = 'open';
        this.price = price;
        this.time = time;
        this.size = size;
    }
}

module.exports = Trade;