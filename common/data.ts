export enum GameState {
    None,
    Started,
    Paused,
    Ended
}

export interface IGame {
    id: string;
    name: string;
    state: GameState;
    time: number;
    initValues: { money: number; stockCount: number; stockPrice: number; };
    players: IPlayer[];
    rates: string[];
    currentNews: ITimedNews;
    preprogrammedNews: ITimedNews[];
    publishedNews: ITimedNews[];
}

export interface INews {
    id: string;
    title: string;
    explanation: string;
    effects: IEffect[];
}

export interface IStock {
    id: string;
    abbreviation: string;
    name: string;
    description: string;
    effects: IEffect[];
}

export interface IRate {
    id: string;
    stock: string;
    price: number[];
}


export interface IEffect {
    stock: string;
    delay: number;
    length: number;
    changeInPercent: number;
}

export interface IPlayer {
    id: string;
    name: string;
    password: string;
    money: number;
    stock: IPlayerStock[];
    transactions: ITransaction[];
}

export enum TransactionKind {
    Buy,
    Sell
}

export interface ITransaction {
    kind: TransactionKind;
    time: number;
    stock: string;
    count: number;
}

export interface IPlayerStock {
    stock: string;
    count: number;
}

export interface ITimedNews {
    news: string[];
    time: number;
}
