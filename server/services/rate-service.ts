import { Rate } from '../entities';
import * as mongoose from 'mongoose';

var express = require('express');
var router = express.Router();

/* Read all */
router.get('/', function (req, res) {
    Rate.find((err, rate) => {
        if (err) {
            res.json({info: 'error during get', error: err});
        };
        res.json({info: 'found successfully', data: rate});
    });
});

/* Find one */
router.get('/:id', function (req, res) {
    let query = { _id: req.params.id};
    Rate.findOne(query, function(err, rate) {
        if (err) {
            res.json({info: 'error during find', error: err});
        };
        if (rate) {
            res.json({info: 'found successfully', data: rate});
        } else {
            res.json({info: 'not found with id:'+ req.params.id});
        }
    });
});

/* Create */
router.post('/', function (req, res) {
    let rate = new Rate(req.body);
    rate.save((err)=>{
        if (err){
            res.json({info: 'error during create', error: err});
        }
        res.json({info: 'created successfully', data: rate}); 
    });
});

/* Partial update */
router.post('/:id', function (req, res) {
    let query = { _id: req.params.id };
    Rate.findByIdAndUpdate(query, { $set: req.body }, {new: true}, (err, rate)=>{
        if (err){
            res.json({info: 'error during partial update', error: err});
        }
        res.json({info: 'updated partially successfully', data: rate}); 
    });
});

/* Full update: should use {overwrite:true} */
router.put('/:id', function (req, res) {
    let query = { _id: req.params.id };
    Rate.findByIdAndUpdate(query, req.body, {new: true}, (err, rate)=>{
        if (err){
            res.json({info: 'error during update', error: err});
        }
        res.json({info: 'updated successfully', data: rate }); 
    });
});

/* Delete */
router.delete('/:id', function (req, res) {
    let query = { _id: req.params.id};
    Rate.remove(query, (err)=>{
        if (err){
            res.json({info: 'error during delete', error: err});
        }
        res.json({info: 'deleted successfully'}); 
    });
});

module.exports = router;
