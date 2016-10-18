import { IPlayer } from '../../common/data';
import { Play } from '../play';
import { Game } from '../entities';
import * as mongoose from 'mongoose';

var express = require('express');
var config = require('../config');
var router = express.Router();
let play: Play = config.Play;

/* Read all */
router.get('/', function (req, res) {
    let game = play.getGame();
    if (game) {
        res.json({info: 'get successful', data: game.players});
    } else {
        res.json({info: 'error during get', error: 'no game'});
    }
});

/* Find one */
router.get('/:id', function (req, res) {
    let game = play.getGame();
    if (game) {
        let id = req.params.id;
        if (id >= 0 && id < game.players.length) {
            res.json({info: 'get successful', data: game.players[id] });
        } else {
            res.json({info: 'error during get', error: 'invalid player index'});
        }
    } else {
        res.json({info: 'error during get', error: 'no game'});
    }
});


module.exports = router;
