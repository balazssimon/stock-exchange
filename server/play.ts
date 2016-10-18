import { IGame, GameState, IRate } from '../common/data';
import { List } from '../common/list';

class GamePlay {
    private _game: IGame;
    private _savedRates: IRate[];
    private _rates: List<number>[];
    
    constructor(game: IGame, savedRates: IRate[]) {
        this._game = game;
        this._savedRates = savedRates;
        if (!this._game.state) {
            this._game.state = GameState.None;
        }
    }

    public getGame(): IGame {
        return this._game;
    }

    public getRates(): IRate[] {
        for (let i = 0; i < this._rates.length; ++i) {
            if (i < this._rates.length) {
                this._savedRates[i].price = this._rates[i].toArray();
            }
        } 
        return this._savedRates;
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
        this._game.time = 0;
        for (let i = 0; i < this._game.players.length; ++i) {
            this._game.players[i].money = this._game.initValues.money;
        }
    }

    public step() {
        if (this._game.state != GameState.Started) return; 
    }
}


export class Play {
    private _gamePlay: GamePlay;
    private _active: boolean;

    constructor() {
    }

    public setGame(game: IGame, savedRates: IRate[]) {
        if (!game) {
            this._gamePlay = null;
            return;
        }
        this._gamePlay = new GamePlay(game, savedRates);
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
        try {
            console.log("GameTimer.run");
            if (!this._active) return;
            if (!this._gamePlay) return; 
            this._gamePlay.step();
            console.log("GameTimer.active");
        } catch(ex) {
            console.log(ex);
        }
    }
}



