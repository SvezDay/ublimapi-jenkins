const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
const path = require('path');
const favicon = require('serve-favicon');
// const chokidar = require('chokidar');

const AuthRoutes = require('./specialRoutes/authRoutes');
const appRoutes = require('./api/appRoutes').routes;
const tokenRoutes = require('./api/tokenRoutes');
// const watcher = chokidar.watch('./api');

const app = express();
const port = process.env.PORT || 3200;
let server = app.listen(port);
let io = require('./api/appRoutes').sockets(server)

// SOCKET MANAGEMENT
// let server = require('http').createServer(app);
// let io = require('socket.io').listen(server);
// let games = io.of('/games');
// games.on('connection', socket=>{
//   console.log("connection socket")
//   socket.on('gamesConnection', ss=>{
//     console.log('connection from games module !')
//   })
//   socket.on('updateBrutData', ss=>{
//     console.log('connection from games module !', ss)
//     socket.emit('updateBrutDataResponse', 'receive !')
//   })
// })


let allowCrossDomain = (req, res, next)=>{
   res.header("Access-Control-Allow-Origin", "http://localhost:5000", "http://localhost:4200", "https://ublimapp.herokuapp.com");
   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token, x-access-token");
   next();
};
let whitelist = ["http://localhost:4200", "http://localhost:5000", "https://ublimapp.herokuapp.com"];

let corsOptions = {
  origin: (origin, callback)=>{
    console.log("=================== origin", origin)
    if(origin == undefined){
      callback(null, true) ;
    } else if(whitelist.indexOf(origin) !== -1){
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// return error message for unauthorized requests
let handleError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message:'Missing or invalid token'});
  }
  // res.status(500).json(err)
};

// app.use({$$DIRNAME:_dirname})
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, 'favicon.ico')));

// app.use(allowCrossDomain);
// app.options('*', cors())
// app.use(handleError);
// app.use(cors(corsOptions));

// Add cors protection
// Add the bodyParser limits
// Add the error module
// Add the scope checking

app.get('/', function(req, res){
  const parser = require('parse-neo4j');
  const driver = require('./dbconnect');
  let session = driver.session();

  session.run("match (n) return count(n)")
  .then(parser.parse)
  .then(data=>{
    console.log('@@@@@@@@@@@@@@@@@@@@ query data:',data)
    session.close();
    driver.close();
    res.status(200).json({'CHECK DB, Number of Node: ': data});
  })
  .catch(err=>{
    res.status(400);
    console.log(err); session.close(); driver.close()
  });
});

app.post('/manual_authenticate', AuthRoutes.manual_authenticate);
app.post('/manual_register', AuthRoutes.manual_register);

// use "glob" to avoid to manage the appRoutes file, but directly in each file
// const docsRoutes = require('./api/docs');
// app.use('/api', docsRoutes);

app.use('/api', tokenRoutes.tokenDecoding, appRoutes());

if(process.env.NODE_ENV=='dev'){
  app.use('/dev', require('./devRoutes/routes.dev')());
  app.use('/devUid', tokenRoutes.tokenDecoding, require('./devRoutes/methodTesting.dev')());
}else{
  process.env.NODE_ENV='production';
}

// if(process.env.NODE_ENV !== 'production'){
//   watcher.on('ready', function(){
//     watcher.on('all', function(){
//       // console.log("Clearing /dist/ module cache from server")
//       Object.keys(require.cache).forEach(function(id) {
//         if (/[\/\\]app[\/\\]/.test(id)) delete require.cache[id]
//       })
//     })
//   })
// }





console.log("process.env.NODE_ENV", process.env.NODE_ENV)
console.log('API server started on: localhost:' + port);
