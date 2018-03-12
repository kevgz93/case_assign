var Users = require('../data/user.model');
var mongoose = require('mongoose');
var Users = require('../controllers/user.controller.js');

var helpers = {};

//Function that checks if the request is authenticated or not.
helpers.isAuthenticated = function(req, res, next){

	var cookie = req.query.sessionid;
	console.log(cookie);

	if(!cookie){
		res.send({status:401,error:'Not Authorized.'});
	}
	else{
		var user = Users.getBySessionId(cookie);
		user.then(function(dbuser){
			if(dbuser){
				next();
			}else{
				res.send({status:401,error:'Not Authorized.'});
			}
		});

	}
}

helpers.isAdmin = function(req, res, next){

		var cookie = req.body.SessionId;
		var user = Users.getBySessionId(cookie);
		//if(){}
		user.then(function(dbuser){
			if(dbuser.role == 'admin'){
				res.status(201);
				next();
			}else{
				res.status(401);
				res.send({status:'error',error:'Not Authorized.'});
			}
		});

}

//find sessionId on the DB


module.exports = helpers;
