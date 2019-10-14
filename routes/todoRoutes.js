
var Bucketlist = require('../model/bucketlistModel');
var config = require('../config/config')
var jwt = require('jsonwebtoken');
var cors = require('cors')

module.exports = function (app, secretKey) { 
  
    //Create a new bucket list
    app.post(`${config.commonRoute}/bucketlists`, cors(), function (req, res) {
       
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secretKey, (err, authorizedData) => {
           
            if (err) {
                res.json({ status: 401, message: 'User must be authourized to create a bucket list' })
            }
            else {
                var list = Bucketlist({
                    name: req.body.name,
                    date_created: req.body.date_created,
                    date_modified: req.body.date_modified,
                    created_by: authorizedData.id,
                })
                if(req.body.name == ""){
                    res.json({ status: 400, message: 'Bucketliist must have a name' })
                }else{
                list.save(function (err) {
                    if (err) {
                        throw err

                    } else {
                        res.json({ status: 200, message: 'Bucketlist created!' })
                    }
                })
            }
            }
        })
    })

    //List all the created bucket lists by a user and search
    app.get(`${config.commonRoute}/bucketlists`,cors(), function (req, res) {
        var token = req.headers.authorization.split(' ')[1];
       
        jwt.verify(token, secretKey, (err, authorizedData) => {
            if (err) {
              
                res.json({ status: 401, message: 'User is not authourized to view this' })
            } else {
                Bucketlist.find({}, function (err, list) {
                    if (err) {
                        throw err;
                    } else {
                        let allitems = []
                        for (let i = 0; i < list.length; i++) {
                             
                            if (authorizedData.id === list[i].created_by) {
                                allitems.push(list[i])
                            }

                        }
                        let response = []
                        if( typeof req.query.q != 'undefined' ){
                            response = allitems.filter(function(bucket){
                               
                                if(bucket.name.includes(req.query.q)){
                                 return (bucket)
                                }
                              });
                        }else{
                            response = allitems
                            
                        }
                        res.send({ status: 200, bucketlist: response })

                    }
                })
            }

        })
    })

    //Get single bucket list 
    app.get(`${config.commonRoute}/bucketlists/:id`, function (req, res) {
        var token = req.headers.Authorization;
        jwt.verify(token, secretKey, (err) => {
            if (err) {
                res.json({ status: 401, message: 'User is not authourized to perform this action' })
            } else {
                Bucketlist.findById({ _id: req.params.id }, function (err, list) {
                    if (err) {
                        throw err;
                    } else {
                        res.send({ status: 200, list: list })
                    }
                })
            }
        })
    })

    //Update this bucketlist
    app.put(`${config.commonRoute}/bucketlists/:id`, function (req, res) {
        var token = req.headers.authorization;
        jwt.verify(token, secretKey, (err) => {
            if (err) {
                res.json({ status: 401, message: 'User is not authourized to perform this action' })
            } else {
                Bucketlist.findByIdAndUpdate(req.params.id, {
                    name: req.body.name,
                    date_modified: req.body.date_modified, done: req.body.done
                },
                    function (err) {
                        if (err) {
                            throw err;
                        } else {
                            res.send({ status: 200, message: 'This bucketlist has been edited successfully!' })
                        }
                    })
            }
        })

    })

    //Delete this bucketlist
    app.delete(`${config.commonRoute}/bucketlists/:id`, function (req, res) {
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secretKey, (err) => {
            if (err) {
                res.json({ status: 401, message: 'User is not authourized to perform this action' })
            } else {
                Bucketlist.findByIdAndDelete(req.params.id, function (err, todo) {
                    if (err) {
                        throw err
                    } else {
                        res.json({ status: 200, message: 'Bucketlist has been deleted successfully!' })
                    }
                })
            }
        })
    })

    
}