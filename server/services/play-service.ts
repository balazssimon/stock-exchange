import { Play } from '../play';
import { Game, Stock, Rate } from '../entities';
import * as mongoose from 'mongoose';

var express = require('express');
var config = require('../config');
var router = express.Router();
var playersService = require('./play-players-service');

let play: Play = config.Play;

router.use('/players', playersService);

router.post('/new', function (req, res) {
    Stock.find((err, stock) => {
        if (err) {
            res.json({info: 'error during create: could not find stocks', error: err});
            return;
        };
        let newGame = new Game(req.body);
        let savedRates = [];
        let error = null;
        savedRates.length = stock.length;
        for (let i = 0; i < stock.length; ++i) {
            savedRates[i] = new Rate({ stock: stock[i].id });
            newGame.rates[i] = savedRates[i].id;
        }
        newGame.save((err)=>{
            if (err){
                error = err;
            }
        });
        play.setGame(newGame, savedRates); 
        for (let i = 0; i < savedRates.length; ++i) {
            savedRates[i].save((err)=>{
                if (err){
                    error = err;
                }
            });
        }
        if (error) {
            res.json({info: 'error during create: could not find stocks', error: error});
        } else {
            res.json({info: 'new game created', data: newGame});
        }
    });
});

router.post('/get', function (req, res) {
    let game = play.getGame();
    console.log(game);
    if (game) {
        res.json({info: 'get was successful', data: game}); 
    } else {
        res.json({info: 'error during get', error: 'no current game'}); 
    }
});

router.post('/start', function (req, res) {
    play.start();
    res.json({info: 'game is started', data: play.getGame()}); 
});

router.post('/stop', function (req, res) {
    play.stop();
    res.json({info: 'game is paused', data: play.getGame()}); 
});

router.post('/end', function (req, res) {
    play.end();
    let game = play.getGame();
    play.setGame(null, null);
    if (game) {
        let saveGame = new Game(game); 
        saveGame.save((err)=>{
            if (err){
                res.json({info: 'error during save', error: err});
            }
            res.json({info: 'saved successfully', data: game}); 
        });
    }
});


module.exports = router;
