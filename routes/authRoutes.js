
var User = require('../model/userModel');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config/config')
var cors = require('cors')


module.exports = function (app, secretKey,) {

    //Login a User
    app.post(`${config.commonRoute}/auth/login`,cors(), function (req, res) {
        if (req.body.name == '' || req.body.password == '') {
            res.json({status:400, message: req.body.name == '' ? 'Username is required' : 'Password is required'})
        } else {
            User.find({ name: req.body.name }, async function (err, userRes) {
                var user = User({
                    name: req.body.name,
                    password: req.body.password,
                })
                user.password = await bcrypt.hash(user.password, 10)
                if (err) {
                    throw err
                } else {
                    
                    if (userRes.length == 1) {
                        bcrypt.compare(req.body.password, userRes[0].password, async function (err, response) {
                            if (response) {
                                const token = jwt.sign({ id: userRes[0]._id }, secretKey, { expiresIn: '24h' });
                               
                                res.json({
                                    status: 200, message: "Login Successful",
                                    data: { id: userRes[0]._id, name: userRes[0].name, bucketlists: userRes[0].bucketlists, token: token }
                                });
                            } else {
                                res.json({ status: 400, message: 'Invalid Username or password' })
                            }
                        });
                    } else if (userRes.length == 0) {
                        await user.save(function (err, newUser) {
                           
                            if (err) {
                                throw err

                            } else {
                                const token = jwt.sign({ id: newUser._id }, secretKey, { expiresIn: '24h' });
                                res.json({
                                    status: 200, message: "Registration Successful",
                                    data: { id: newUser._id, name: newUser.name, bucketlists: newUser.bucketlists, token: token }
                                });
                            }
                        })
                    } else {
                        res.json({ status: 400, message: 'Username is already in use' })
                    }

                }
            })
        }
    })





}