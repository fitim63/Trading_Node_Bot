const Strategy = require('./strategy');

class SimpleStrategy extends Strategy {
    async run({sticks, time}) {
        const len = sticks.length;
        if (len < 20) {
            return
        }
        const oneBeforeLast = sticks[len - 2].closePrice;
        const last = sticks[len - 1].closePrice;
        const price = last;
        const open = this.openPosition();

        if (open.length === 0) {
            if (last < oneBeforeLast) {
                this.onBuySignal({price, time});
            }
        } else {
            if (last > oneBeforeLast) {
                open.forEach(p => {
                    if (p.enter.price * 1.01 < price) {
                        this.onSellSignal({price, size: p.enter.size, position: p, time});
                    }
                });
            }
        }
    }
}

module.exports = SimpleStrategy;