import { Game } from '../entities';
import * as mongoose from 'mongoose';

var express = require('express');
var router = express.Router();

/* Read all */
router.get('/', function (req, res) {
    Game.find((err, game) => {
        if (err) {
            res.json({info: 'error during get', error: err});
        };
        res.json({info: 'found successfully', data: game});
    });
});

/* Find one */
router.get('/:id', function (req, res) {
    let query = { _id: req.params.id};
    Game.findOne(query, function(err, game) {
        if (err) {
            res.json({info: 'error during find', error: err});
        };
        if (game) {
            res.json({info: 'found successfully', data: game});
        } else {
            res.json({info: 'not found with id:'+ req.params.id});
        }
    });
});

/* Create */
router.post('/', function (req, res) {
    let game = new Game(req.body);
    game.save((err)=>{
        if (err){
            res.json({info: 'error during create', error: err});
        }
        res.json({info: 'created successfully', data: game}); 
    });
});

/* Partial update */
router.post('/:id', function (req, res) {
    let query = { _id: req.params.id };
    Game.findByIdAndUpdate(query, { $set: req.body }, {new: true}, (err, game)=>{
        if (err){
            res.json({info: 'error during partial update', error: err});
        }
        res.json({info: 'updated partially successfully', data: game}); 
    });
});

/* Full update: should use {overwrite:true} */
router.put('/:id', function (req, res) {
    let query = { _id: req.params.id };
    Game.findByIdAndUpdate(query, req.body, {new: true}, (err, game)=>{
        if (err){
            res.json({info: 'error during update', error: err});
        }
        res.json({info: 'updated successfully', data: game }); 
    });
});

/* Delete */
router.delete('/:id', function (req, res) {
    let query = { _id: req.params.id};
    Game.remove(query, (err)=>{
        if (err){
            res.json({info: 'error during delete', error: err});
        }
        res.json({info: 'deleted successfully'}); 
    });
});

module.exports = router;
