const express = require('express');
const bakeryRouter = express.Router();

bakeryRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send bakery info to you');
})
.post((req, res) => {
    res.end(`Will add the bakery: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /bakeries');
})
.delete((req, res) => {
    res.end('Deleting all bakeries');
});

bakeryRouter.route("/:bakeryId")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the bakery: ${req.params.bakeryId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /bakeries/${req.params.bakeryId}`);
})
.put((req, res) => {
    res.write(`Updating the bakery: ${req.params.bakeryId}\n`);
    res.end(`Will update the bakery: ${req.body.name} with description: ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting bakery: ${req.params.bakeryId}`);
});

module.exports = bakeryRouter;