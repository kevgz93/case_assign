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
  var month = date.getMonth() + 1;

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
      { "$project": {
        "id": 1,
        "email": 1,
        "city": 1,
        "work_start": 1,
        "work_end": 1,
        "time_zone": 1,
        "sta_dyn": 1,
        "max_case": 1,
        "name": 1,
        "last_name": 1,
        "cases_loaded": {
           "$filter": {
               "input": "$cases_loaded",
               "as": "case",
               "cond": { "$eq": [ "$$case.date.month", month ] }
           }
        }
    }}
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
      day: date.getDate(),
      month: month,
      year: date.getFullYear(),
    },
    time: time,
    engineer_id: req.body.engi_id,
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
      }

      if (response.status != 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
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

    });
};



module.exports = ticket;
