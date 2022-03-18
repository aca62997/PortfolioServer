const express = require('express');
const Bakery = require('../models/bakery');

const bakeryRouter = express.Router();

bakeryRouter.route('/')
.get((req, res, next) => {
    Bakery.find()
    .then(bakeries => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(bakeries);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Bakery.create(req.body)
    .then(bakery => {
        console.log('Bakery Created ', bakery);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(bakery);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /bakeries');
})
.delete((req, res, next) => {
    Bakery.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

bakeryRouter.route('/:bakeryId')
.get((req, res, next) => {
    Bakery.findById(req.params.bakeryId)
    .then(bakeryRouter => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(bakery);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /bakeries/${req.params.bakeryId}`);
})
.put((req, res, next) => {
    Bakery.findByIdAndUpdate(req.params.bakeryId, {
        $set: req.body
    }, { new: true })
    .then(bakery => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(bakery);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Bakery.findByIdAndDelete(req.params.bakeryId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = bakeryRouter;