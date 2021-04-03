const errors = require('restify-errors');
const Urldb = require('../models/urldb');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = server =>{
    // Get 
    server.get('/route2',async (req, res,next)=>{
        console.log(req.params.id,req.params.str);

        try {
            
            const posts = await Urldb.aggregate([
                {
                    '$match':{
                        '_id':ObjectId(req.params.id)
                    }
                },
                {
                    '$unwind':{ 'path':'$urls' }
                },
                {
                '$group':{
                    '_id': "$urls._id",
                    'name':{'$first':'$urls.name'},
                    'url':{'$first':'$urls.url'},
                    'count':{'$first':'$urls.count'}
                }
                },
                {
                '$match': {
                    'name': new RegExp(req.params.str, 'i')
                }
            }
            
            
            ])
            res.send({posts});
            next();

        } catch (err) {

            return next(new errors.InvalidContentError(err));
            
        }
    })








}