var scheduleModel = require('../data/schedule.model.js');
var mongoose = require('mongoose');
var q = require('q');

var db = mongoose.model('schedule');
var schedule = {};


schedule.createSchedule = function (req, res) {
    console.log(req.body);

    if(!req.body.user_id || !req.body.monday_morning_hour || !req.body.monday_afternoon_hour || !req.body.tuesday_morning_hour || !req.body.tuesday_afternoon_hour || 
    !req.body.wednesday_morning_hour|| !req.body.wednesday_afternoon_hour || !req.body.thursday_morning_hour || !req.body.thursday_afternoon_hour || !req.body.friday_morning_hour
    || !req.body.friday_afternoon_hour)
    {
        res.status(400);
        res.send({status:'error',error:'Values missing.'});
    }
    let minutes = 0;
    //let difference = {"hour": -5, "minutes":30}

    db.create({ 
        monday_morning : {
            hour:req.body.monday_morning_hour + req.body.difference.hour, //req.body.
            minutes: req.body.monday_morning_minutes + req.body.difference.minutes
        },
        monday_afternoon : {
            hour:req.body.monday_afternoon_hour + req.body.difference.hour,
            minutes: req.body.monday_afternoon_minutes + req.body.difference.minutes
        },
        tuesday_morning: {
            hour:req.body.tuesday_morning_hour + req.body.difference.hour,
            minutes: req.body.tuesday_morning_minutes + req.body.difference.minutes
        },
        tuesday_afternoon: {
            hour:req.body.tuesday_afternoon_hour + req.body.difference.hour,
            minutes: req.body.tuesday_afternoon_minutes + req.body.difference.minutes
        },
        wednesday_morning: {
            hour:req.body.wednesday_morning_hour + req.body.difference.hour,
            minutes: req.body.wednesday_morning_minutes + req.body.difference.minutes
        },
        wednesday_afternoon: {
            hour:req.body.wednesday_afternoon_hour + req.body.difference.hour,
            minutes: req.body.wednesday_afternoon_minutes + req.body.difference.minutes
        },
        thursday_morning : {
            hour:req.body.thursday_morning_hour + req.body.difference.hour,
            minutes: req.body.thursday_morning_minutes + req.body.difference.minutes
        },
        thursday_afternoon : {
            hour:req.body.thursday_afternoon_hour + req.body.difference.hour,
            minutes: req.body.thursday_afternoon_minutes + req.body.difference.minutes
        },
        friday_morning: {
            hour:req.body.friday_morning_hour + req.body.difference.hour,
            minutes: req.body.friday_morning_minutes + req.body.difference.minutes
        },
        friday_afternoon: {
            hour:req.body.friday_afternoon_hour + req.body.difference.hour,
            minutes: req.body.friday_afternoon_minutes + req.body.difference.minutes
        },
        time_zone: req.body.time,
        day_off:{
            day:req.body.day_off_day,
            month: req.body.day_off_month,
            hour: req.body.day_off_hour,
            minutes: req.body.day_off_minutes
        },
        day_on: {
            day:req.body.day_on_day,
            month: req.body.day_on_month,
            hour: req.body.day_on_hour,
            minutes: req.body.day_on_minutes
        },
        user_id: req.body.user_id
    }, function(err, user) { //this will run when create is completed
      if(err) {
        console.log("Error creating a Schedule");
        res
          .send({status:401,body:err});

      } else {
        console.log("schedule created");
        console.log(user);

        res
          .send({status:201,body:user});

      }
  })
}

schedule.getScheduleId = function(req, res){
var schedu = schedule.findUser(req.query.id)
schedu.then(function(sched){
    console.log(sched);
        res.send({status: 200, body: sched});
    }, function(){
        res.send({status: 404,error:'Error occured while fetching data from database.'});
    });

}

//Find the user and send it again to getUserBySessionID
schedule.findUser = function(id){
    var results = q.defer();

    db.findOne({user_id: id},function(err, dbuser) {
        if (dbuser){
        results.resolve(dbuser);

    }  else{
            var response = {};
            response.status = 'error';
            response.error = 'Schedule not found it';
            results.resolve(response);
        }
    });

    return results.promise;
}

schedule.updateSchedule = function (req, res) {

var user_id = req.body._id;
console.log("Get User" + user_id);

db
    .findOne({user_id : user_id})
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
        console.log("body", req.body);
        doc.monday_morning.hour = req.body.monday_morning_hour + req.body.difference.hour,
        doc.monday_morning.minutes = req.body.monday_morning_minutes,
        doc.monday_afternoon.hour = req.body.monday_afternoon_hour + req.body.difference.hour,
        doc.monday_afternoon.minutes = req.body.monday_afternoon_minutes,
        doc.tuesday_morning.hour= req.body.tuesday_morning_hour + req.body.difference.hour,
        doc.tuesday_morning.minutes= req.body.tuesday_morning_minutes,
        doc.tuesday_afternoon.hour= req.body.tuesday_afternoon_hour + req.body.difference.hour,
        doc.tuesday_afternoon.minutes= req.body.tuesday_afternoon_minutes,
        doc.wednesday_morning.hour= req.body.wednesday_morning_hour + req.body.difference.hour,
        doc.wednesday_morning.minutes= req.body.wednesday_morning_minutes,
        doc.wednesday_afternoon.hour= req.body.wednesday_afternoon_hour + req.body.difference.hour,
        doc.wednesday_afternoon.minutes= req.body.wednesday_afternoon_minutes,
        doc.thursday_morning.hour = req.body.thursday_morning_hour + req.body.difference.hour,
        doc.thursday_morning.minutes = req.body.thursday_morning_minutes,
        doc.thursday_afternoon.hour = req.body.thursday_afternoon_hour + req.body.difference.hour,
        doc.thursday_afternoon.minutes = req.body.thursday_afternoon_minutes,
        doc.friday_morning.hour= req.body.friday_morning_hour + req.body.difference.hour,
        doc.friday_morning.minutes= req.body.friday_morning_minutes,
        doc.friday_afternoon.hour= req.body.friday_afternoon_hour + req.body.difference.hour,
        doc.friday_afternoon.minutes= req.body.friday_afternoon_minutes,
        time_zone= req.body.time
        //doc.day_off= req.body.day_off,
        //doc.day_on= req.body.day_on

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

//add the time off for specific User
schedule.createTimeOff = function (req, res) {

    var user_id = req.body._id;
    console.log("Get User" + user_id);
    
    db
        .findOne({user_id : user_id})
        .exec(function(err, doc){
        var response = {
            status: 204,
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
    
        if (response.status === 200) {
            console.log("send it here?");
            res
            .status(response.status)
            .json(response.message);
        } else {
            console.log("body", req.body);
            doc.day_off.day=req.body.day_off.day,
            doc.day_off.month= req.body.day_off.month,
            doc.day_off.hour= req.body.day_off.hour,
            doc.day_off.minutes= req.body.day_off.minutes,
            doc.day_on.day=req.body.day_on.day,
            doc.day_on.month= req.body.day_on.month,
            doc.day_on.hour= req.body.day_on.hour,
            doc.day_on.minutes= req.body.day_on.minutes

    
        };
    
        doc.save(function(err, Updated) {
            if (err) {
            res
                .send({status: 500});
    
            } else {
            res
            .send({status:204, body:Updated})
    
            }
            })
        })
    }

module.exports = schedule;