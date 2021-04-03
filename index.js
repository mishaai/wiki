const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
//const errors = require('restify-errors');
const mongoose = require('mongoose');

const config = require('./config');



const server = restify.createServer({
    name: 'SpaceX',
    version: '1.0.0'
  });

  const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*'],
  })
  
  server.pre(cors.preflight)
  server.use(cors.actual)



// Middleware
server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use(restify.plugins.bodyParser({
    mapParams: true
}));

  function crossOrigin(req,res,next){
 
    res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Credentials", "true");
		res.header("Access-Control-Max-Age", "1800");
		res.header("Access-Control-Allow-Headers", "content-type");
		res.header("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
    return next();
  }
  function optionsRoute(req, res, next) {

    res.send(200);
    return next();
}

server.opts('/\.*/', crossOrigin, optionsRoute);



server.listen(config.PORT,()=>{
    mongoose.connect(
        config.MONGODB_URI,
        {   
            useNewUrlParser:true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }
        );
});


const db = mongoose.connection;

db.on('error',(err)=>{console.log(err)});

db.once('open',()=>{
    require('./routes/route1')(server); 
    require('./routes/route2')(server);

    console.log(`Server started on port ${config.PORT}`);
});
