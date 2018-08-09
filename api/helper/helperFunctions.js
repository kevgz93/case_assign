var Users = require('../data/user.model');
var mongoose = require('mongoose');
var Users = require('../controllers/user.controller.js');

var helpers = {};

//Function that checks if the request is authenticated or not.
helpers.isAuthenticated = function(req, res, next){

	var cookie = req.query.sessionid;

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

		var cookie = req.body.sessionId;
		if (!cookie){
			cookie = req.query.sessionId;
		}
		var user = Users.getBySessionId(cookie);
		//if(){}
		
		user.then(function(dbuser){
			
			if(dbuser.role == 'admin'){
				console.log("Authorized");
				next();
			}else{
				res.status(401);
				res.send({status:'error',error:'Not Authorized.'});
			}
		});

}

//find sessionId on the DB


module.exports = helpers;
