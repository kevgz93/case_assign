var userModel = require('../data/user.model.js');
var mongoose = require('mongoose');
var cookie = require('cookie-parser');

var q = require('q');

var db = mongoose.model('user');
var users = {};


//make a sessionId
function makeSessionId()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 32; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// controller that handles user login request
users.auth = function (req, res) {
  var date = new Date();
  var cookie = req.cookies.day;
  console.log(cookie);
  if(!cookie){
    var datecookie =  date.getDate() + "-" +date.getMonth() +"-" +date.getFullYear();
    console.log("first time cookies")
    res.cookie('day', date.getDay());
    res.cookie('date', datecookie.toString());
    res.cookie('month', date.getMonth());
  }

	if(!req.body.username || !req.body.password)
	{
		res.status(400);
		res.send({status:"error",error:'Username or password is missing.'});
	}

  var user = users.authUser(req.body.username, req.body.password);
	user.then(function(users){
    res.cookie('SessionId' , users.sessionId, {domain: '127.0.0.1', httpOnly: true});
    res.status(201)
		.json(users);
	}, function(){
    res.status(500)
		.json({status:"error", error:'Error occured while fetching data from database.'});
	});

};

// controller that handles user login request
users.authUser = function(username, password){
	var results = q.defer();

	db.findOne({username: username, password: password},function(err, dbuser) {
		if (err){
			results.reject(err);
		}


		if(dbuser){

			dbuser.activeSession = makeSessionId();
			dbuser.markModified('string');
			dbuser.save(function(err, dbuser){
				var response = {};
        response.status = 'success'
				response.sessionId = dbuser.activeSession;
        response.username = dbuser.username;
			  results.resolve(response);

			});


		} else{
			var response = {};
			response.error = 'Invalid username or password';
		  	results.resolve(response);
		}
	});

	return results.promise;
}

users.register = function (req, res) {


	if(!req.body.username || !req.body.password)
	{
		res.status(400);
		res.send({status:'error',error:'Username or password is missing.'});
  }

  db.create({
    email : req.body.email,
  		city : req.body.city,
  	  time_zone: req.body.time,
      sta_dyn: req.body.sta_dyn,
      max_case: req.body.max,
      status: req.body.status,
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      last_name: req.body.last_name,
      activeSession: "",
      role: req.body.role,
      day_off: "",
	    day_on: "",
      days_working: 365,
      last_case:""
      
    }, function(err, user) { //this will run when create is completed
      if(err) {
        console.log("Error creating a User");
        res
          .status(400)
          .json(err);

      } else {
        console.log("User created");
        console.log(user);

        res
          .status(201)
          .json({status:201,user:user});

      }
    });


};

//Function to return users by its sessionID.
users.getBySessionId = function(sessionId){
	var results = q.defer();

	db.findOne({activeSession: sessionId},function(err, dbuser) {
		if (err){
			results.reject(err);
		}


		results.resolve(dbuser);
	});

	return results.promise;
}

//Function to return all users.

users.getUser = function(req, res){
  var user = users.getUser2()
	user.then(function(users){
    console.log(users);
		res.send(users);
	}, function(){
		res.send({status:'error',error:'Error occured while fetching data from database.'});
	});

}

users.getUser2 = function(){
	var results = q.defer();

	db.find(function(err, users) {
	  if (err){
	  	results.reject(err);
	  }
	  results.resolve(users);
	});
	return results.promise;
}

//catch the cookie and send the user.

users.getUserBySessionId = function(req, res){
  var user = users.findUser(req.cookies.SessionId)
	user.then(function(users){
    console.log(users);
		res.send({status:201, body:users});
	}, function(){
		res.send({status:500,error:'Error occured while fetching data from database.'});
	});

}

//Find the user and send it again to getUserBySessionID
users.findUser = function(session){
	var results = q.defer();

	db.findOne({activeSession: session},function(err, dbuser) {
		if (dbuser){
			var response = {};

				response.status = 'success';
				response.username = dbuser.username;
			  results.resolve(response);

    }  else{
			var response = {};
			response.status = 'error';
			response.error = 'Invalid username or password';
		  	results.resolve(response);
		}
	});

	return results.promise;
}


//Logout main
users.logout = function(req, res){
  var user = users.logoutUser(req);
  user.then(function(users){
    console.log(users);
    console.log("logout success")
		res.send({status: 'successful'});
	}, function(){
		res.send({status:'error',error:'Error occured while fetching data from database.'});
	});
}


//Function to logout user.
users.logoutUser = function(req){
	var results = q.defer();
  var sessionId = req.cookies.SessionId;
  	console.log('helper cookie ' + sessionId);
	db.findOne({activeSession: sessionId},function(err, dbuser) {
		if (err){
			results.reject(err);
		}
		if(dbuser){
			dbuser.activeSession='';
			dbuser.markModified('string');
			dbuser.save();
			results.resolve(dbuser);
		}

	});
	return results.promise;
}

users.userGetOne = function(req, res) {

var h;
  var userId = req.params.userId;
  console.log("Get user " + userId);

  db
    .findById(userId)
    .exec(function(err, doc){
      var response = {
        status: 200,
        message: doc
      };

      //console.log(doc);

      if (err) {
        console.log("Error finding user");
        response.status = 500;
        response.message = err;
      } else if(!doc){
        response.status= 404;
        response.message = {
          "message":"user ID not found"
        };
      }
      res
        .status(response.status)
        .json(response.message);

    });
};

users.usersUpdateOne = function (req, res) {

  var userId = req.params.id;
  console.log("Get User" + userId);

  db
    .findById(userId)
    .exec(function(err, doc){
      var response = {
        status: 200,
        message: doc
      };

      if (err) {
        console.log("Error finding user");
        response.status = 500;
        response.message = err;
      } else if(!doc){
        response.status= 404;
        response.message = {
          "message":"User ID not found"
        };
      }

      if (response.status != 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        doc.email = req.body.email,
        doc.city = req.body.city,
        doc.time_zone= req.body.time,
        doc.sta_dyn= req.body.sta_dyn,
        doc.max_case= req.body.max,
        doc.username= req.body.username,
        doc.password= req.body.password,
        doc.name= req.body.name,
        doc.lastName= req.body.lastName,
        doc.role= req.body.role

      };

      doc.save(function(err, userUpdated) {
        if (err) {
          res
            .status(500)
            .json(err);

        } else {
          res
          .status(204)
          .json(userUpdated)
        }
      })
    });
};

users.usersDeleteOne = function(req, res) {
  var userId = req.params.userId;

  db
    .findByIdAndRemove(userId)
    .exec(function(err, userId){
      if (err) {
        res
          .status(404)
          .json(err);
      } else {
        console.log('user deleted ID: ', userId);
        res
          .status(204)
          .json(userId);
      }
    });
};

users.changeDaysWorking = function(engi_id, status)
{
  db
    .findById(engi_id)
    .exec(function(err, doc){
      var response = {
        status: 200,
        message: doc
      };

      if (err) {
        console.log("Error finding user");
        response.status = 500;
        response.message = err;
      } else if(!doc){
        response.status= 404;
        response.message = {
          "message":"User ID not found"
        };
      }

      if (response.status != 200) {
        return response;
      } else {
        doc.days_working = 365
      };

      doc.save(function(err, statusUpdated) {
        if (err) {
          return "error to save status"

        } else {
          return 'saved status successful'
        }
      })
    });
}

users.changeStatus = function(engi_id, status)
{
  db
    .findById(engi_id)
    .exec(function(err, doc){
      var response = {
        status: 200,
        message: doc
      };

      if (err) {
        console.log("Error finding user");
        response.status = 500;
        response.message = err;
      } else if(!doc){
        response.status= 404;
        response.message = {
          "message":"User ID not found"
        };
      }

      if (response.status != 200) {
        return response;
      } else {
        doc.status = status
      };

      doc.save(function(err, statusUpdated) {
        if (err) {
          return "error to save status"

        } else {
          return 'saved status successful'
        }
      })
    });
}

users.loadUsers = function(req, res) {
date = new Date();
day = date.getDate();
month = date.getMonth()+1;
year = date.getFullYear();
fullday = day.toString() + month.toString() + year.toString();
console.log(fullday);

  var engineer = users.loadUsers2();
  engineer.then(function(engineers){

    for(var i in engineers)
    {
      console.log(engineers[i].day_off)
      if(engineers[i].day_off == fullday)
      {
        console.log("status changes to false: " + engineers[i].name)
        users.changeStatus(engineers[i].id, false);
      }
      else if(engineers[i].day_on == fullday)
      {
        console.log("status changes to true: " + engineers[i].name)
        users.changeStatus(engineers[i].id, true)
      }
      else if(day == '1' & month == '1'){
        users.changeDaysWorking(engineers[i].id);
      }

    }
    res
    .status(302)
    .json({message:'succefull'});

  }, function(){
    res.send({status:'error',error:'Error occured while fetching data from database.'});
  });

};

users.loadUsers2 = function(){
  var results = q.defer();

	db.find(function(err, users) {
	  if (err){
	  	results.reject(err);
	  }
	  results.resolve(users);
	});
	return results.promise;

  }

  users.addTimeOff = function(res, req){
    db.findById(req.body.id)
    .exec(function(err, engi){
      var response = {
        status: 200,
        message: doc
      };

      if (err) {
        console.log("Error finding user");
        response.status = 500;
        response.message = err;
      } else if(!doc){
        response.status= 404;
        response.message = {
          "message":"User ID not found"
        };
      }

      if (response.status != 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        doc.off = req.body.day_off,
        doc.day_on = req.body.day_on,
        doc.days_working = doc.days_working - req.body.totalDays;

      };

      doc.save(function(err, timeOffUpdated) {
        if (err) {
          res
            .status(500)
            .json(err);

        } else {
          res
          .status(204)
          .json(timeOffUpdated)
        }
      })
    })
  }


module.exports = users;
