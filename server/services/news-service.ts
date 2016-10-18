import { News } from '../entities';
import * as mongoose from 'mongoose';

var express = require('express');
var router = express.Router();

/* Read all */
router.get('/', function (req, res) {
    News.find((err, news) => {
        if (err) {
            res.json({info: 'error during get', error: err});
        };
        res.json({info: 'found successfully', data: news});
    });
});

/* Find one */
router.get('/:id', function (req, res) {
    let query = { _id: req.params.id};
    News.findOne(query, function(err, news) {
        if (err) {
            res.json({info: 'error during find', error: err});
        };
        if (news) {
            res.json({info: 'found successfully', data: news});
        } else {
            res.json({info: 'not found with id:'+ req.params.id});
        }
    });
});

/* Create */
router.post('/', function (req, res) {
    let news = new News(req.body);
    news.save((err)=>{
        if (err){
            res.json({info: 'error during create', error: err});
        }
        res.json({info: 'created successfully', data: news}); 
    });
});

/* Partial update */
router.post('/:id', function (req, res) {
    let query = { _id: req.params.id };
    News.findByIdAndUpdate(query, { $set: req.body }, {new: true}, (err, news)=>{
        if (err){
            res.json({info: 'error during partial update', error: err});
        }
        res.json({info: 'updated partially successfully', data: news}); 
    });
});

/* Full update: should use {overwrite:true} */
router.put('/:id', function (req, res) {
    let query = { _id: req.params.id };
    News.findByIdAndUpdate(query, req.body, {new: true}, (err, news)=>{
        if (err){
            res.json({info: 'error during update', error: err});
        }
        res.json({info: 'updated successfully', data: news }); 
    });
});

/* Delete */
router.delete('/:id', function (req, res) {
    let query = { _id: req.params.id};
    News.remove(query, (err)=>{
        if (err){
            res.json({info: 'error during delete', error: err});
        }
        res.json({info: 'deleted successfully'}); 
    });
});

module.exports = router;
