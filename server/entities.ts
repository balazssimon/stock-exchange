import * as mongoose from 'mongoose';

import { IGame, INews, IStock, IRate } from '../common/data';

export interface GameEntity extends IGame, mongoose.Document { }
export interface NewsEntity extends INews, mongoose.Document { }
export interface StockEntity extends IStock, mongoose.Document { }
export interface RateEntity extends IRate, mongoose.Document { }

let GameSchema = new mongoose.Schema({
    name: String,
    state: { type: String, enum : ['0', '1', '2', '3'] },
    time: Number,
    initValues: { money: Number, stockCount: Number, stockPrice: Number },
    players: [{
        id: String,
        name: String,
        password: String,
        money: Number,
        stock: [{stock: String, count: Number}],
        transactions: [{kind: { type: String, enum : ['0', '1'] }, time: Number, stock: String, count: Number }]
    }],
    rates: [String],
    currentNews: { news: [String], time: Number },
    preprogrammedNews: [ { news: [String], time: Number } ],
    publishedNews: [ { news: [String], time: Number } ]
});

let NewsSchema = new mongoose.Schema({
    title: String,
    explanation: String,
    effects: [{ stock: String, delay: Number, length: Number, changeInPercent: Number }]
});

let StockSchema = new mongoose.Schema({
    abbreviation: String,
    name: String,
    description: String,
    effects: [{ stock: String, delay: Number, length: Number, changeInPercent: Number }]
});

let RateSchema = new mongoose.Schema({
    stock: String,
    price: [Number]
});

export var Game = mongoose.model<GameEntity>('Game', GameSchema);
export var News = mongoose.model<NewsEntity>('News', NewsSchema);
export var Stock = mongoose.model<StockEntity>('Stock', StockSchema);
export var Rate = mongoose.model<RateEntity>('Rate', RateSchema);
