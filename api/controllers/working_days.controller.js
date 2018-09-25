
var userModel = require('../data/user.model.js');
var mongoose = require('mongoose');

var q = require('q');

var db = mongoose.model('user');
var users = {};

// when a time off start, we changes the values from working days.
users.updateWorkingDays = function(req, res)
{
  let _id = req.body._id;
  let working_days = req.body.working_days;
  let reference = req.body.reference;
  console.log("reference", reference);


  db
    .findById(_id)
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
        doc.working_days.current_days = doc.working_days.current_days  - working_days.current,
        doc.working_days.next_month = working_days.next,
        doc.working_days.dayoff = 30 - doc.working_days.current_days,
        doc.working_days.status = true,
        doc.working_days.next_month_status = true,
        doc.working_days.timeoff_reference = reference
      };

      doc.save(function(err, result) {
        if (err) {
          return res.send(err);

        } else {
          return res.send({status:204,body:result.working_days});
        }
      })
    });
}

//When start a new month
users.newMonthStart = function(req, res)
{
    let _id = req.query._id;
  db
    .findById(_id)
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
        doc.working_days.current_days = 30 - doc.working_days.next_month,
        doc.working_days.next_month = 0,
        doc.working_days.dayoff = 30 - doc.working_days.current_days,
        doc.working_days.next_month_status = false
        
      };

      doc.save(function(err, result) {
        if (err) {
          return res.send(err);

        } else {
          return res.send({status:204,body:result.working_days});
        }
      })
    });
}


//When end timeoff
users.endTimeoff = function(req, res)
{
    let _id = req.body._id;
  db
    .findById(_id)
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
        doc.working_days.status = false
      };

      doc.save(function(err, result) {
        if (err) {
          return res.send(err);

        } else {
          return res.send({status:204,body:result.working_days});
        }
      })
    });
}


module.exports = users;