require('./api/data/db.js');

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); //important to have this line
var cookieParser = require('cookie-parser');
var cors = require('cors');
//before the routes.

var routes = require('./api/routes');


var app = express();

app.use(cors());
app.set('port', 8888);


app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Method', 'GET, PUT, DELETE, POST');
  res.header('Access-Control-Allow-Headers', '*');
  
  console.log('middleware: '+ req.method, req.url);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(bodyParser.urlencoded({extended: false })); //if can give access to other data type but is not common
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', routes);
app.use('/angular', express.static(__dirname + '/node_modules/@angular'));
/*
app.use('/cssCustom', express.static(__dirname + '/public/_css/customCssFile.css'));
//app.use('/mainjs', express.static(__dirname + '/public/_scripts/main.js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/angular', express.static(__dirname + '/node_modules/angular'));
app.use('/angular-route', express.static(__dirname + '/node_modules/angular-route'));
app.use('/md5', express.static(__dirname + '/node_modules/angular-md5/angular-md5.min.js'));
app.use('/fonts', express.static(__dirname + '/fonts'));
*/

//app.use('/angular-route', express.static(__dirname + '/node_modules/angular-route'));
var server = app.listen(app.get('port'), function(){
  var port = server.address().port;
  console.log('we are working on port ' + port);  //This verify we are working on a ASYNC app
});
