const express = require('express');
const Bakery = require('../models/bakery');
const authenticate = require('../authenticate');

const bakeryRouter = express.Router();

bakeryRouter.route('/')
.get((req, res, next) => {
    Bakery.find()
    .populate('comments.author')
    .then(bakeries => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(bakeries);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Bakery.create(req.body)
    .then(bakery => {
        console.log('Bakery Created ', bakery);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(bakery);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /bakeries');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
    .populate('comments.author')
    .then(bakery => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(bakery);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /bakeries/${req.params.bakeryId}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Bakery.findByIdAndDelete(req.params.bakeryId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

bakeryRouter.route('/:bakeryId/comments')
.get((req, res, next) => {
    Bakery.findById(req.params.bakeryId)
    .populate('comments.author')
    .then(bakery => {
        if (bakery) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(bakery.comments);
        } else {
            err = new Error(`Bakery ${req.params.bakeryId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Bakery.findById(req.params.bakeryId)
    .then(bakery => {
        if (bakery) {
            req.body.author = req.user._id;
            bakery.comments.push(req.body);
            bakery.save()
            .then(bakery => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(bakery);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Bakery ${req.params.bakeryId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /bakeries/${req.params.bakeryId}/comments`);
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Bakery.findById(req.params.bakeryId)
    .then(bakery => {
        if (bakery) {
            for (let i = (bakery.comments.length-1); i >= 0; i--) {
                bakery.comments.id(bakery.comments[i]._id).remove();
            }
            bakery.save()
            .then(bakery => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(bakery);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Bakery ${req.params.bakeryId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

bakeryRouter.route('/:bakeryId/comments/:commentId')
.get((req, res, next) => {
    Bakery.findById(req.params.bakeryId)
    .populate('comments.author')
    .then(bakery => {
        if (bakery && bakery.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(bakery.comments.id(req.params.commentId));
        } else if (!bakery) {
            err = new Error(`Bakery ${req.params.bakeryId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /bakeries/${req.params.bakeryId}/comments/${req.params.commentId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Bakery.findById(req.params.bakeryId)
    .then(bakery => {
        if (bakery && bakery.comments.id(req.params.commentId)) {
            if (req.body.rating) {
                bakery.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.text) {
                bakery.comments.id(req.params.commentId).text = req.body.text;
            }
            bakery.save()
            .then(bakery => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(bakery);
            })
            .catch(err => next(err));
        } else if (!bakery) {
            err = new Error(`Bakery ${req.params.bakeryId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Bakery.findById(req.params.bakeryId)
    .then(bakery => {
        if (bakery && bakery.comments.id(req.params.commentId)) {
            if((bakery.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
            bakery.comments.id(req.params.commentId).remove();
            bakery.save()
            .then(bakery => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(bakery);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`You are not the Author!`);
            err.status = 403;
            return next(err);
        }
        } else if (!bakery) {
            err = new Error(`Bakery ${req.params.bakeryId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = bakeryRouter;