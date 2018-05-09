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

	if(!req.body.username || !req.body.password)
	{
		res.send({status:"error",error:'Username or password is missing.'});
	}

  var user = users.authUser(req.body.username, req.body.password);
	user.then(function(users){
    res.send(users);
	}, function(){
    res.status(500)
		.send(users);
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
				response.sessionid = dbuser.activeSession;
        response.name = dbuser.name;
        response.last_name = dbuser.last_name;
        response.action = "login";
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
      sta_dyn: req.body.sta_dyn,
      max_case: req.body.max,
      status: req.body.status,
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      last_name: req.body.last_name,
      activeSession: "",
      role: req.body.role,
      working_days: 60,
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
  let sessionid;
  let user;
  if(!req.query.sessionid)
  {
    sessionid = "k3v1n1gg3";
  }
  else{
    sessionid = req.query.sessionid;
  }
  user = users.findUser(sessionid);
  console.log(sessionid);
	user.then(function(user_found){
    console.log(user_found);
    if(user_found.status == 401)
    {
      res.send({status:401});
    }
    else{
      res.send({status:201,body:user_found})
    }
		
	}, function(){
		res.send({status:500,error:'Error occured while fetching data from database.'});
	});

}

//Find the user and send it again to getUserBySessionID
users.findUser = function(session){
  var results = q.defer();
  var response = {};

	db.findOne({activeSession: session},function(err, dbuser) {
		if (dbuser){

        response.name = dbuser.name;
        response.last_name = dbuser.last_name;
        response._id = dbuser._id;
        response.role = dbuser.role;
			  results.resolve(response);

    }  else{

			response.status = 401;
			response.error = 'SessionId not found';
		  	results.resolve(response);
		}
	});

	return results.promise;
}


//Logout main
users.logout = function(req, res){
  var sessionId = req.body.SessionId;
  var user = users.logoutUser(sessionId);
  user.then(function(users){
    console.log(users);
    console.log("logout success")
		res.send({status: 'success'});
	}, function(){
		res.send({status:'error',error:'Error occured while fetching data from database.'});
	});
}


//Function to logout user.
users.logoutUser = function(sessionId){
	var results = q.defer();
  
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

  var userId = req.query.id;
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
        .send({status: response.status, body: response.message});

    });
};

users.getUsersWithNamesOnly = function(req, res, next) {

  var engineer = users.loadEnginners2()
  engineer.then(function(engineers){
    console.log(engineers);
    //jso = engineers;
    //next()
    res.send(engineers);
  }, function(){
    res.send({status:'error',error:'Error occured while fetching data from database.'});
  });

};

users.loadEnginners2 = function(){
  var results = q.defer();


  db.aggregate(
    [
      {
        $match:{
          "status":true
        }
      },  
        { "$project": {
          "name":1,
          "last_name":1,
          "_id":1
        }
      }
    ],function(err, engi) {
      
      if (err){
        results.reject(err);
      }
      results.resolve(engi);
      
    });
    
    return results.promise;

  }

users.usersUpdateOne = function (req, res) {

  var userId = req.body._id;
  var doc = {};
  doc.email = req.body.email,
  doc.city = req.body.city,
  doc.sta_dyn= req.body.sta_dyn,
  doc.max_case= req.body.max,
  doc.username= req.body.username,
  doc.password= req.body.password,
  doc.name= req.body.name,
  doc.lastName= req.body.lastName,
  doc.role= req.body.role
  doc.status= req.body.status
  console.log("Get User" + userId);

  db
    .findByIdAndUpdate(userId, doc, {new:true}, function(err, user){

      if(err){
        res.send({status: 404});
      }
        res
        .send({status:204, body:user});
    })

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
