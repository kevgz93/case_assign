var tick_engi = require('../data/case.model.js');
var bitacora = require('./bitacora.controller');
var userModel = require('../data/user.model.js');


var mongoose = require('mongoose');

var q = require('q');

var ticket = {};

//var bitacora = mongoose.model('bitacora');
var user = mongoose.model('user');
var _cases = mongoose.model('case');


var jso;
var jso2 = [];



ticket.loadEnginner = function(req, res, next) {

  var engineer = ticket.loadEnginner2()
  engineer.then(function(engineers){
    console.log(engineers);
    //jso = engineers;
    //next()
    res.send(engineers);
  }, function(){
    res.send({status:'error',error:'Error occured while fetching data from database.'});
  });

};

ticket.loadEnginner2 = function(){
  var results = q.defer();
  var date = new Date();


  user.aggregate(
    [
      {
        $match:{
          "status":true
        }
      },
      {
        $lookup: {
          from: 'cases', 
          localField: '_id', 
          foreignField: 'engineer_id', 
          'as': 'cases_loaded'
        }
      },
      {
        $lookup: {
          from: 'schedules', 
          localField: '_id', 
          foreignField: 'user_id', 
          'as': 'schedule_loaded'
        }
<<<<<<< HEAD
      },
        { "$project": {
          "_id": 1,
          "email":1,
          "city":1,
          "time_zone":1,
          "sta_dyn":1,
          "max_case":1,
          "username":1,
          "password":1,
          "name":1,
          "last_name":1,
          "activeSession":1,
          "status":1,
          "role":1,
          "day_on":1,
          "day_off":1,
          "days_working":1,
          "last-case":1,
          "cases_loaded":{             
            "$filter": {
              "input": "$cases_loaded",
              "as": "case",
              "cond": { "$eq": [ "$$case.action", "added" ] }
            }
          },
          "schedule_loaded":1
        }
=======
>>>>>>> af607aa28ac628b8180339f91360baf10f363ac8
      }
    ],function(err, engi) {
      
      if (err){
        results.reject(err);
      }
      results.resolve(engi);
      
    });
    
    return results.promise;

  }




ticket.addTicket = function (req, res ) { //user_id, engi_id
  var date = new Date();
  month = (date.getMonth() + 1);
  time = (date.getHours() +1) + ':' + date.getMinutes() + " EST";
  _cases.create({
    user_id: req.body.user_id,
    action: 'added',
    date: {
      day: date.getDay(),
      date: date.getDate(),
      month: month,
      year: date.getFullYear(),
    },
    time: time,
    engineer_id: req.body.engi_id
    }, function(err, tickt) { //this will run when create is completed
      if(err) {
        console.log("Error creating a User");
        res
          .status(400)
          .json(err);

      } else {
        console.log("User created");
        console.log(tickt);

        res
          .status(201)
          .json(tickt);
      }
    });

}

<<<<<<< HEAD
ticket.ticketDelete2 = function (req, res, user){
  console.log("Entro para Editar el caso")
  var response;
  _cases.findById(user.last_case).exec(function(err, doc){
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
      doc.action = "deleted"
    };

    doc.save(function(err, caseUpdated) {
      if (err) {
        res
          .status(500)
          .json(err);

      } else {
        res
        .status(204)
        .json(caseUpdated)
      }
    })
  });
}

ticket.ticketDelete = function (req, res) {

  var _id = req.body._id;
  //console.log("Get hotels" + engirId);

  user
    .findById(_id)
    .exec(function(err, doc){
      var response;
      if (err) {
        console.log("Error finding user");
        response = err;
      } else if(!doc){
        response = {"Messages": "Not user ID Found"}
=======
ticket.ticketDelete = function (req, res) {

  var user_id = req.body.user_id;
  //console.log("Get hotels" + engirId);

  user
    .findById(engirId)
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
>>>>>>> af607aa28ac628b8180339f91360baf10f363ac8
      }

      if (response.status != 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
<<<<<<< HEAD
        ticketDelete2(doc);
      }
=======
        doc.day = doc.day - 1;
        doc.week = doc.week - 1;
        doc.month = doc.month - 1;
        bitacora.addBitacora(req.cookies.SessionId, "delete ticket", doc._id, doc.eng_name, doc.last_name);


        doc.save(function(err, engiUpdated) {
          if (err) {
            res.send({message : err});

          } else {
            res.send({status:204, message : "ticket Deleted"});
          }
        })
      };
>>>>>>> af607aa28ac628b8180339f91360baf10f363ac8

    });
};



module.exports = ticket;
