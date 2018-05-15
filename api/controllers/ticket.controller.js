var tick_engi = require('../data/case.model.js');
var bitacora = require('./report.controller');
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
          foreignField: 'engineer.engineer_id', 
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
          "last_case":1,
          "cases_loaded":{             
            "$filter": {
              "input": "$cases_loaded",
              "as": "case",
              "cond": { "$eq": [ "$$case.action", "added" ] }
            }
          },
          "schedule_loaded":1
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


ticket.saveOnUser = function (ticket_id, engi_id, res){
  var response = {};
  user.findById(engi_id)
  .exec(function(err, doc){
    if(err){
      res.send("error to find the engineer")
    }
    else{
      console.log(ticket_id, engi_id);
      doc.last_case = ticket_id.toString();
    }

    doc.save(function(err, caseUpdated) {
      if (err) {
        console.log(err);
      } else {
        console.log(caseUpdated);
      }
    })
  });
}

ticket.addTicket = function (req, res ) { //user_id, engi_id
  var date = new Date();
  var response;
  month = (date.getMonth() + 1);
  time = (date.getHours() +1) + ':' + date.getMinutes() + " EST";
  _cases.create({
    user: {
      user_id :req.body.user_id,
      user_name:req.body.user_name,
      user_last_name : req.body.user_last_name
  },
    action: 'added',
    date: {
      day: date.getDay(),
      date: date.getDate(),
      month: month,
      year: date.getFullYear(),
    },
    time: time,
    engineer: {
      engineer_id:req.body.engi_id,
      engi_name: req.body.engi_name,
      engi_last_name: req.body.engi_last_name
    }
    }, function(err, tickt) { //this will run when create is completed
      if(err) {
        console.log("Error creating a User");
        res
          .status(400)
          .json(err);

      } else {
        console.log("User created");
        console.log(tickt);
        ticket.saveOnUser(tickt._id, req.body.engi_id, res);
        res.send(tickt);
      }

    });
    return;
}

ticket.ticketDelete2 = function (user, res){
  console.log("Entro para Editar el caso")
  var response;
  _cases.findById(user.last_case).exec(function(err, doc){
    var response = {
      status: 200,
      message: doc
    };

    if (err) {
      console.log("Error finding user");
      res.status(500)
        .json(err);
    } else if(!doc){
      res.status(400)
      .json("Error not document loaded");
    }

    if (response.status != 200) {
      return response;
    } else {
      doc.action = "deleted"
    };

    doc.save(function(err, caseUpdated) {
      if (err) {
        res.status(404)
        .json(err);


      } else {
        res.status(201)
        .json(caseUpdated);

      }
    })

  });
}

ticket.findcase = function(last_case, res){
  console.log("entro")
  _cases.findById(last_case).exec(function(err, doc){
    var response = {
      status: 200,
      message: doc
    };

    if (err) {
      console.log("Error finding case");
      res.status(500)
        .json(err);
    } else if(!doc){
      res.status(400)
      .json("Error not document loaded");
    }

    if (response.status != 200) {
      return response;
    } else {
      doc.action = "deleted"
    };

    doc.save(function(err, caseUpdated) {
      if (err) {
        res.status(404)
        .json(err);


      } else {
        res.status(201)
        .json(caseUpdated);

      }
    })

  });
}

ticket.ticketDelete = function (req,res ) {

  var id = req.body.engi_id;
  console.log("Id Delete",id);
  var response;

  //console.log("Get hotels" + engirId);

  user
    .findById(id)
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
      else{
        ticket.findcase(doc.last_case, res);
        return;
      }
      res
        .status(response.status)
        .json(response.message);
    });
    
};



module.exports = ticket;
