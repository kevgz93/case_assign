var scheduleModel = require('../data/time_off.model.js');


var mongoose = require('mongoose');

var q = require('q');

var time_report = {};
var time_off = mongoose.model('timeoff');
var ObjectId = mongoose.Schema.ObjectId;


//reduce working_days on
time_report.reduce_working_days = function(day_off, day_on,total_days){

    let days_to_discount;
    if(day_off.month != day_on.month){
        days_to_discount = total_days - day_on.day;
    }
    else{
        days_to_discount = total_days;
    }

}

//create the time off
time_report.addTime_off = function(req, res){
    let data = req.body;
    console.log("data", data);
    let status;
    time_off.create({
        user_id :data.user_id,
        action: "added",
        reason: data.reason,
        reason_delete_modify: "",
        day_off: {
            day:data.day_off.day,
            month: data.day_off.month,
            year:data.day_off.year,
            hour:data.day_off.hour + data.difference.hour,
            minutes:data.day_off.minutes + data.difference.minutes
        },
        day_on : {
            day:data.day_on.day,
            month: data.day_on.month,
            year:data.day_off.year,
            hour:data.day_on.hour + data.difference.hour,
            minutes:data.day_on.minutes+ data.difference.minutes
        }
        
        }, function(err, time) { //this will run when create is completed
          if(err) {
            console.log("Error creating a User");
            res.send({status:404,body:time});

          } else {
            res.send({status:201,body:time});
            //reduce_working_days(data.day_off, data.data_on, data.count_days);
          }
        });
}

//get specific time offs by _id
time_report.getOneTime_off = function (req, res){
    _id = req.query._id;
    time_off
      .findById(_id, function(err, doc){
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
          .send({status:501});
      } else {
        res
          .send({status:204,body:doc})
      }

    })
}

//get all time offs for specific user
time_report.getUserAllTime_off = function (req, res){
    user_id = req.query.user_id;

    time_off
      .find({user_id : user_id,action:{$in:["added", "modified"]}},function(err, doc){
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
          .send({status:501});
      } else {
        res
          .send({status:204,body:doc})
      }

    })
}

//update the time off
time_report.updateTime_off = function (req, res) {

  var _id = req.body._id;
  
  time_off
      .findById(_id, function(err, doc){
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
        let data = req.body;
          doc.action = "modified",
          doc.reason = data.reason,
          doc.day_off.day = data.day_off.day,
          doc.day_off.month = data.day_off.month,
          doc.day_off.year = data.day_off.year,
          doc.day_off.hour = data.day_off.hour + data.difference.hour,
          doc.day_off.minutes = data.day_off.minutes + data.difference.minutes,
          doc.day_on.day = data.day_on.day,
          doc.day_on.month = data.day_on.month,
          doc.day_on.year = data.day_on.year,
          doc.day_on.hour = data.day_on.hour + data.difference.hour,
          doc.day_on.minutes = data.day_on.minutes + data.difference.minutes,
          doc.reason_delete_modify = data.reason_delete_modify
      };
  
      doc.save(function(err, Updated) {
          if (err) {
          res
            .send({status: 500});
  
          } else {
          res
          .send({status:204});
  
          }
          })
      })
  }


  //delete (modify the action) for the time off
  time_report.deleteTime_off = function (req, res) {

    var _id = req.query._id;
    var reasonMD = req.query.reasonMD;
    
    time_off
        .findById(_id, function(err, doc){
        var response = {
            status: 200,
            message: doc
        };
    
        if (err) {
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
            doc.action = "deleted",
            doc.reason_delete_modify = reasonMD

        };
    
        doc.save(function(err, Updated) {
            if (err) {
            res
              .send({status: 500});
    
            } else {
            res
            .send({status:204});
    
            }
            })
        })
    }

module.exports = time_report;