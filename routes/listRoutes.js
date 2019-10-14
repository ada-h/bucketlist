var itemList = require('../model/itemsModel')
var Bucketlist = require('../model/bucketlistModel');
var config = require('../config/config');
var jwt = require('jsonwebtoken');


module.exports = function (app, secretKey) {

    //Create a new item in bucket list
    app.post(`${config.commonRoute}/bucketlists/:id/items`, function (req, res) {

         var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secretKey, (err) => {
            var item = itemList({
                bucketlistId: req.params.id,
                name: req.body.name,
                date_created: req.body.date_created,
                date_modified: req.body.date_modified,
                done: req.body.done
    
            })
            if (err) {
                res.json({ status: 401, message: 'User must be authourized to add item to this bucketlist' })
            } else {
                Bucketlist.findById(req.params.id, function (err, bucketlist) {
                    if (err) {
                        throw err
                    } else {

                        item.save(function (err, newItem) {
                            if (err) {
                                throw err
                            } else {

                                bucketlist.items.push(newItem._id)
                                bucketlist.save(function (err, newList) {
                                    if (err) {
                                        throw err
                                    } else {
                                        res.json({ status: 200, message: 'Item added successfully', data: newList, })
                                    }
                                })
                            }
                        })

                    }
                })
            }
        })

    })

    //List all the created items in a bucket lists
    app.get(`${config.commonRoute}/bucketlists/:id/items`, function (req, res) {
         var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secretKey, (err) => {
            if (err) {
                res.json({ status: 401, message: 'User must be authourized to view items in this bucketlist' })
            } else {
        Bucketlist.findById(req.params.id, async function (err, bucketitems) {
            if (err) {
                throw err
            } else {
                let allitems = []
                for (let i = 0; i < bucketitems.items.length; i++) {
                    await itemList.findById(bucketitems.items[i], function (err, thisItem) {
                        if (err) {
                            throw err
                        } else {

                            allitems.push(thisItem)
                        }
                    })
                }

                res.json({ status: 200, data: allitems })
            }
        })
    }
})

    })


    //Get a single item in a bucket list
    app.get(`${config.commonRoute} bucketlists/:bucketId/items/:listId`, function (req, res) {
         var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secretKey, (err, authorizedData) => {
            if (err) {
                res.json({ status: 401, message: 'User must be authourized to add item to this bucketlist' })
            } else {
        Bucketlist.findById({ _id: req.params.bucketId }, function (err, bucketlist) {
            if (err) {
                throw err;
            } else {
                if (bucketlist.items.includes(req.params.listId)) {
                    itemList.findById(req.params.listId, function (err, item) {
                        if (err) {
                            throw err
                        } else {
                            res.json({ status: 200, data: item })
                        }
                    })
                } else {
                    res.json({ status: 401, message: "This item does not exisit in this bucket list" })
                }
            }
        })
    }
})
    })

    //Update a particular list item
    app.put(`${config.commonRoute}/bucketlists/:bucketId/items/:listId`, function (req, res) {
         var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secretKey, (err, authorizedData) => {
            if (err) {
                res.json({ status: 401, message: 'User must be authourized to add item to this bucketlist' })
            } else {
        Bucketlist.findById({ _id: req.params.bucketId }, function (err, bucketlist) {
            if (err) {
                throw err;
            } else {
                if (bucketlist.items.includes(req.params.listId)) {
                    itemList.findByIdAndUpdate(req.params.listId, {
                        name: req.body.name,
                        date_created: req.body.date_created,
                        date_modified: req.body.date_modified,
                        done: req.body.done
                    }, function (err) {
                        if (err) {
                            throw err
                        } else {
                            res.json({ status: 200, message: "List has been updated successfully" })
                        }
                    })
                } else {
                    res.json({ status: 401, message: "This item does not exist in this bucket list" })
                }
            }
        })
    }
})
    })


    // //Delete this item from  bucketlist
    app.delete(`${config.commonRoute}/bucketlists/:bucketId/items/:listId`, function (req, res) {
         var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secretKey, (err, authorizedData) => {
            if (err) {
                res.json({ status: 401, message: 'User must be authourized to add item to this bucketlist' })
            } else {
        Bucketlist.findById({ _id: req.params.bucketId }, function (err, bucketlist) {
            if (err) {
                throw err;
            } else {
                if (bucketlist.items.includes(req.params.listId)) {
                  
                    itemList.findByIdAndDelete(req.params.listId, function (err) {
                        if (err) {
                            throw err
                        } else {
                            res.json({ status: 200, message: "This entry has been deleted successfully" })
                        }
                    })
                } else {
                    res.json({ status: 401, message: "This item does not exist in this bucket list" })
                }
            }
        })
    }
})
    })
}