import { IGame, GameState, IRate, IStock, StockIndex, INews, ITimedNews } from '../common/data';
import { List } from '../common/list';
import { Ziggurat } from '../common/ziggurat';

class GamePlay {
    private _game: IGame;
    private _stockCount: number; 
    private _stocks: StockIndex;
    private _savedRates: IRate[];
    private _rates: List<number>[];
    private _currentEffects: { mean: number, stddev: number }[];
    private _news: INews[];
    private _stockMap: { [id: string]: number };
    private _newsMap: { [id: string]: INews };
    private _effectiveNews: List<ITimedNews>;
    private _random: Ziggurat;
    
    constructor(game: IGame, stocks: StockIndex, savedRates: IRate[], news: INews[]) {
        this._game = game;
        this._stocks = stocks;
        this._savedRates = savedRates;
        this._stockCount = this._savedRates.length;
        this._news = news;
        if (!this._game.state) {
            this._game.state = GameState.None;
        }
        this._rates = [];
        this._rates.length = this._savedRates.length;
        for (let i = 0; i < this._savedRates.length; ++i) {
            this._rates[i] = new List<number>();
            this._rates[i].addRange(this._savedRates[i].price);
        }
    }

    public getGame(): IGame {
        return this._game;
    }

    public getRates(): IRate[] {
        for (let i = 0; i < this._rates.length; ++i) {
            if (i < this._savedRates.length) {
                this._savedRates[i].price = this._rates[i].toArray();
            }
        } 
        return this._savedRates;
    }

    public getNews(): INews[] {
        return this._news;
    }

    public start(): boolean {
        if (this._game.state == GameState.None) {
            this.initGame();
            this._game.state = GameState.Paused;
        }
        if (this._game.state == GameState.Paused) {
            this._game.state = GameState.Started;
        }
        return this._game.state == GameState.Started;
    }

    public stop() {
        if (this._game.state == GameState.Started) {
            this._game.state = GameState.Paused;
        }
    }

    public end() {
        this._game.state = GameState.Ended;
    }

    private initGame() {
        if (this._game.state != GameState.None) return;
        this._random = new Ziggurat();
        this._game.time = 0;
        for (let i = 0; i < this._game.players.length; ++i) {
            this._game.players[i].money = this._game.initValues.money;
            this._game.players[i].transactions = [];
            this._game.players[i].stock = [];
            this._game.players[i].stock.length = this._stockCount;
            for (let j = 0; j < this._stockCount; ++j) {
                this._game.players[i].stock[j].stock = this._savedRates[j].id;
                this._game.players[i].stock[j].count = 0;
            }
        }
        this._currentEffects = [];
        this._currentEffects.length = this._stockCount;
        for (let j = 0; j < this._stockCount; ++j) {
            this._currentEffects[j] = { mean: 0.0, stddev: 0.01 };
        }
        this._stockMap = {};
        for (let i = 0; i < this._stocks.stocks.length; ++i) {
            this._stockMap[this._stocks.stocks[i].id] = i;
        }
        this._newsMap = {};
        for (let i = 0; i < this._news.length; ++i) {
            this._newsMap[this._news[i].id] = this._news[i];
        }
        console.log(this._game);
        this._effectiveNews = new List<ITimedNews>();
        this._effectiveNews.addRange(this._game.currentNews);
    }

    public step() {
        if (this._game.state != GameState.Started) return;
        try {
            this.initEffects();
            this.addEffects();
            this.calculateNewRates();
            for (let i = 0; i < this._rates.length; ++i) {
                console.log(this._rates[i]);
            }
        } finally {
            ++this._game.time;
        }
    }

    private calculateNewRates() {
        let currentTime = this._game.time;
        for (let i = 0; i < this._rates.length; ++i) {
            let rate = this._rates[i];
            let value = 0;
            if (currentTime == 0) {
                value = this._game.initValues.stockPrice;
            }
            if (rate.count() > 0) {
                value = rate.get(rate.count()-1);
            }
            while (currentTime > rate.count()) {
                rate.add(value);
            }
            if (rate.count() > currentTime) {
                rate.truncate(currentTime);
            }
            let change = this._random.nextGaussian(this._currentEffects[i].mean, this._currentEffects[i].stddev);
            let newValue = value * (1.0 + change);
            rate.add(newValue);
        } 
    }

    private initEffects() {
        for (let j = 0; j < this._stockCount; ++j) {
            this._currentEffects[j].mean = 0;
            this._currentEffects[j].stddev = 0.01;
        }
    }

    private addEffects() {
        this.addNewsEffects();
        for (let j = 0; j < this._stockCount; ++j) {
            this.addStockEffects(j);
        }
    }

    private addNewsEffects() {
        console.log(this._effectiveNews);
        for (let j = this._effectiveNews.count()-1; j >= 0; --j) {
            let timedNews = this._effectiveNews.get(j);
            let active: boolean = false;
            if (this._game.time >= timedNews.time) {
                let newsList = timedNews.news.map((nid: string) => this._newsMap[nid]);
                for (let i = 0; i < newsList.length; ++i) {
                    let news = newsList[i];
                    for (let k = 0; k < news.effects.length; ++k) {
                        let effect = news.effects[k];
                        if (this._game.time <= timedNews.time + effect.delay + effect.length) {
                            active = true;
                            let stockIdx = this._stockMap[effect.stock];
                            let deltaTime = this._game.time - timedNews.time - effect.delay;
                            if (stockIdx && deltaTime >= 0) {
                                this._currentEffects[stockIdx].mean += this.percentToFraction(effect.changeInPercent, effect.length); 
                            }
                        }
                    }
                } 
            } else {
                active = true;
            }
            if (!active) {
                this._effectiveNews.delete(j);
            }
        }
    }

    private addStockEffects(stockIdx: number) {
        let stockMean = this._currentEffects[stockIdx].mean;
        let stockStdDev = this._currentEffects[stockIdx].mean;
        let effectIndices = this._stocks.sourceEffectIndex[stockIdx];
        for (let j = 0; j < effectIndices.length; ++j) {
            let effectIdx = effectIndices[j];
            let sourceStockIdx = effectIdx.stockIndex;
            let sourceStock = this._stocks.stocks[sourceStockIdx];
            let sourceEffectIdx = effectIdx.effectIndex;
            let sourceEffect = sourceStock.effects[sourceEffectIdx];
            let sourceRate = this._rates[sourceStockIdx];
            if (sourceEffect.length <= 1) {
                let i = this._game.time;
                if (i > 0) {
                    let currentSourceRate = sourceRate.get(i);
                    let previousSourceRate = sourceRate.get(i-1);
                    if (currentSourceRate < 1) currentSourceRate = 1;
                    if (previousSourceRate < 1) previousSourceRate = 1;
                    let deltaRate = currentSourceRate/previousSourceRate-1.0;
                    this._currentEffects[stockIdx].mean += this.percentToFraction(sourceEffect.changeInPercent, sourceEffect.length)*deltaRate;
                }
            } else {
                let minTime = this._game.time-sourceEffect.length-sourceEffect.delay;
                let maxTime = this._game.time-sourceEffect.delay;
                if (minTime < 0) minTime = 0;
                if (maxTime < 0) maxTime = 0;
                ++minTime;
                for (let i = minTime; i < maxTime; ++i) {
                    let currentSourceRate = sourceRate.get(i);
                    let previousSourceRate = sourceRate.get(i-1);
                    if (currentSourceRate < 1) currentSourceRate = 1;
                    if (previousSourceRate < 1) previousSourceRate = 1;
                    let deltaRate = currentSourceRate/previousSourceRate-1.0;
                    this._currentEffects[stockIdx].mean += this.percentToFraction(sourceEffect.changeInPercent, sourceEffect.length)*deltaRate;
                }
            }
        }
    }

    private percentToFraction(fullPerCent: number, length: number) {
        if (length <= 1) return fullPerCent/100.0;
        let perCent = Math.pow(Math.abs(fullPerCent/100.0), 1/length);
        if (fullPerCent < 0) perCent = -perCent;
        return perCent;
    }
}


export class Play {
    private _gamePlay: GamePlay;
    private _active: boolean;

    constructor() {
    }

    public setGame(game: IGame, stocks: StockIndex, savedRates: IRate[], news: INews[]) {
        if (!game) {
            this._gamePlay = null;
            return;
        }
        this._gamePlay = new GamePlay(game, stocks, savedRates, news);
    }

    public getGame(): IGame {
        if (!this._gamePlay) return null;
        return this._gamePlay.getGame();
    }

    public start() {
        if (!this._gamePlay) return;
        this._active = this._gamePlay.start();
    }

    public stop() {
        this._active = false;
        if (!this._gamePlay) return;
        this._gamePlay.stop();
    }

    public end() {
        this._active = false;
        if (!this._gamePlay) return;
        this._gamePlay.end();
    }

    public run() {
        //try {
            console.log("GameTimer.run");
            if (!this._active) return;
            if (!this._gamePlay) return; 
            this._gamePlay.step();
            console.log("GameTimer.active");
        /*} catch(ex) {
            console.log(ex);
        }*/
    }
}



