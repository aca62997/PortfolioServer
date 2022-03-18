const express = require('express');
const User = require('../models/user');
const passport = require('passport');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
    User.findOne({username: req.body.username})
    .then(user => {
        if (user) {
            const err = new Error(`User ${req.body.username} already exists!`);
            err.status = 403;
            return next(err);
        } else {
            User.create({
                username: req.body.username,
                password: req.body.password})
            .then(user => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({status: 'Registration Successful!', user: user});
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
});

router.post('/signup', (req, res) => {
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        err => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            }
        }
    );
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});
});

module.exports = router;