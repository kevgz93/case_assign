var scheduleModel = require('../data/schedule.model.js');
var mongoose = require('mongoose');
var q = require('q');

var db = mongoose.model('schedule');
var schedule = {};


schedule.createSchedule = function (req, res) {
    console.log(req.body.user_id);

    if(!req.body.user_id || !req.body.monday_morning || !req.body.monday_afternoon || !req.body.tuesday_morning || !req.body.tuesday_afternoon || 
    !req.body.wednesday_morning|| !req.body.wednesday_afternoon || !req.body.thursday_morning || !req.body.thursday_afternoon || !req.body.friday_morning
    || !req.body.friday_afternoon)
    {
        res.status(400);
        res.send({status:'error',error:'Values missing.'});
    }

    db.create({ 
        monday_morning : req.body.monday_morning,
        monday_afternoon : req.body.monday_afternoon,
        tuesday_morning: req.body.tuesday_morning,
        tuesday_afternoon: req.body.tuesday_afternoon,
        wednesday_morning: req.body.wednesday_morning,
        wednesday_afternoon: req.body.wednesday_afternoon,
        thursday_morning : req.body.thursday_morning,
        thursday_afternoon : req.body.thursday_afternoon,
        friday_morning: req.body.friday_morning,
        friday_afternoon: req.body.friday_afternoon,
        user_id: req.body.user_id
    }, function(err, user) { //this will run when create is completed
      if(err) {
        console.log("Error creating a Schedule");
        res
          .status(400)
          .json(err);

      } else {
        console.log("schedule created");
        console.log(user);

        res
          .status(201)
          .json({status:201,user:user});

      }
  })
}

schedule.getScheduleId = function(req, res){
var schedu = schedule.findUser(req.body.user_id)
schedu.then(function(sched){
    console.log(sched);
        res.send(sched);
    }, function(){
        res.send({status:'error',error:'Error occured while fetching data from database.'});
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

var user_id = req.params.user_id;
console.log("Get User" + user_id);

    db
        .findById(user_id)
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
            doc.user_id = req.body.user_id,
            doc.monday = req.body.monday,
            doc.tuesday = req.body.tuesday,
            doc.wednesday = req.body.wednesday,
            doc.thursday = req.body.thursday,
            doc.friday = req.body.friday

        };

        doc.save(function(err, Updated) {
            if (err) {
            res
                .status(500)
                .json(err);

            } else {
            res
            .status(204)
            .json(Updated)
            }
        })
    })
}

module.exports = schedule;