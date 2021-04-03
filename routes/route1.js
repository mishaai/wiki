const errors = require('restify-errors');
const parser = require('../modules/parser');
const Urldb = require('../models/urldb');
const fs = require('fs');

module.exports = server =>{
    // Get 
    server.get('/route1',async (req, res,next)=>{
        console.log(req.params.url,req.params.num);

        try {
            const id =await Urldb.findOne({url:req.params.url});
            if(id) return res.send({url:id.url,_id:id._id});

            res.send(201);
            
            const data = await parser(req.params.url,req.params.num);
            
            const db = new Urldb({url:req.params.url,urls:data});
            let ss = await db.save();
            next();

        } catch (err) {

            return next(new errors.InvalidContentError(err));
            
        }
    })



}