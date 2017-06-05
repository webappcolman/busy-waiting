var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var Message = require('../models/message');
var Restaurant = require('../models/restaurant');

router.get('/', function (req, res, next) {
    Restaurant.find()
        .populate('user', 'firstName')
        .exec(function (err, restaurants) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                restaurant: 'Success',
                obj: restaurants
            });
        });
});

router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        next();
    })
});

router.post('/', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        var restaurant = new Restaurant({
            Name: req.body.name,
            Address: req.body.address,
            Rating: req.body.rating,
            Phone: req.body.phone,
            user: user
        });
        restaurant.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            user.restaurants.push(result);
            user.save();
            res.status(201).json({
                message: 'Saved restaurant',
                obj: result
            });
        });
    });
});

router.patch('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Restaurant.findById(req.params.id, function (err, restaurant) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!restaurant) {
            return res.status(500).json({
                title: 'No Restaurant Found!',
                error: {message: 'Restaurant not found'}
            });
        }
        if (restaurant.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        }
        restaurant.Name = req.body.name;
        restaurant.Address = req.body.address;
        restaurant.Rating = req.body.rating;
        restaurant.Phone = req.body.phone;
        restaurant.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Updated Restaurant',
                obj: result
            });
        });
    });
});

router.delete('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Restaurant.findById(req.params.id, function (err, restaurant) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!restaurant) {
            return res.status(500).json({
                title: 'No Restaurant Found!',
                error: {message: 'Restaurant not found'}
            });
        }
        if (restaurant.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        }
        restaurant.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted message',
                obj: result
            });
        });
    });
});

module.exports = router;
