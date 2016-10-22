import { List } from './list';

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
    currentNews: ITimedNews[];
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

export class StockIndex {
    stocks: IStock[];
    targetEffectIndex: number[][];
    sourceEffectIndex: SourceEffectIndex[][];
}

class SourceEffectIndex {
    stockIndex: number;
    effectIndex: number;
}

function stockTopologicalOrder(stocks: IStock[]): IStock[] {
    if (stocks.length == 0) return [];
    let stack: List<IStock> = new List<IStock>();
    let visitOrder: List<IStock> = new List<IStock>();
    let leaveOrder: List<IStock> = new List<IStock>();
    let effects = stocks.map((s: IStock) => s.effects.map((e: IEffect) => stocks.find((es: IStock) => es.id == e.stock)));
    stack.add(stocks[0]);
    visitOrder.add(stocks[0]);
    while (!stack.isEmpty()) {
        let currentIndex = stack.count()-1;
        let current = stack.get(currentIndex);
        let stockIndex = stocks.indexOf(current);
        let added = false;
        if (stockIndex >= 0) {
            let children = effects[stockIndex];
            for (let i = 0; i < children.length; ++i) {
                let child = children[i];
                if (child && !visitOrder.contains(child)) {
                    added = true;
                    stack.add(child);
                    visitOrder.add(child);
                    break;
                }
            }
        }
        if (!added) {
            stack.delete(currentIndex);
            leaveOrder.add(current);
            if (stack.isEmpty() && visitOrder.count() < stocks.length) {
                for (let i = 0; i < stocks.length; ++i) {
                    if (!visitOrder.contains(stocks[i])) {
                        stack.add(stocks[i]);
                        visitOrder.add(stocks[i]);
                        break;
                    }
                }
            }
        }
    }
    return leaveOrder.toArray();
} 

export function calculateStockIndex(stocks: IStock[]): StockIndex {
    let result: StockIndex = new StockIndex();
    result.stocks = stockTopologicalOrder(stocks);
    result.targetEffectIndex = stocks.map((s: IStock) => s.effects.map((e: IEffect) => result.stocks.findIndex((es: IStock) => es.id == e.stock)));
    result.sourceEffectIndex = [];
    result.sourceEffectIndex.length = result.stocks.length;
    for (let i = 0; i < result.stocks.length; ++i) {
        let sourceEffects: List<SourceEffectIndex> = new List<SourceEffectIndex>();
        for (let j = 0; j < i; ++j) {
            let sourceIdx = result.targetEffectIndex[j].findIndex((ei: number) => ei == i);
            if (sourceIdx >= 0) {
                let sourceEffect: SourceEffectIndex = new SourceEffectIndex();
                sourceEffect.stockIndex = j;
                sourceEffect.effectIndex = sourceIdx;
                sourceEffects.add(sourceEffect);
            }
        }
        result.sourceEffectIndex[i] = sourceEffects.toArray();
    }
    return result;
}