import { Stock } from '../entities';
import * as mongoose from 'mongoose';

var express = require('express');
var router = express.Router();

/* Read all */
router.get('/', function (req, res) {
    Stock.find((err, stock) => {
        if (err) {
            res.json({info: 'error during get', error: err});
        };
        res.json({info: 'found successfully', data: stock});
    });
});

/* Find one */
router.get('/:id', function (req, res) {
    let query = { _id: req.params.id};
    Stock.findOne(query, function(err, stock) {
        if (err) {
            res.json({info: 'error during find', error: err});
        };
        if (stock) {
            res.json({info: 'found successfully', data: stock});
        } else {
            res.json({info: 'not found with id:'+ req.params.id});
        }
    });
});

/* Create */
router.post('/', function (req, res) {
    let stock = new Stock(req.body);
    stock.save((err)=>{
        if (err){
            res.json({info: 'error during create', error: err});
        }
        res.json({info: 'created successfully', data: stock}); 
    });
});

/* Partial update */
router.post('/:id', function (req, res) {
    let query = { _id: req.params.id };
    Stock.findByIdAndUpdate(query, { $set: req.body }, {new: true}, (err, stock)=>{
        if (err){
            res.json({info: 'error during partial update', error: err});
        }
        res.json({info: 'updated partially successfully', data: stock}); 
    });
});

/* Full update: should use {overwrite:true} */
router.put('/:id', function (req, res) {
    let query = { _id: req.params.id };
    Stock.findByIdAndUpdate(query, req.body, {new: true}, (err, stock)=>{
        if (err){
            res.json({info: 'error during update', error: err});
        }
        res.json({info: 'updated successfully', data: stock }); 
    });
});

/* Delete */
router.delete('/:id', function (req, res) {
    let query = { _id: req.params.id};
    Stock.remove(query, (err)=>{
        if (err){
            res.json({info: 'error during delete', error: err});
        }
        res.json({info: 'deleted successfully'}); 
    });
});

module.exports = router;
