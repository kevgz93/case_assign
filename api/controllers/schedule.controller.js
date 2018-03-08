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
        day_off: req.body.day_off,
        day_on: req.body.day_on,
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
            doc.monday_morning = req.body.monday_morning,
            doc.monday_afternoon = req.body.monday_afternoon,
            doc.tuesday_morning= req.body.tuesday_morning,
            doc.tuesday_afternoon= req.body.tuesday_afternoon,
            doc.wednesday_morning= req.body.wednesday_morning,
            doc.wednesday_afternoon= req.body.wednesday_afternoon,
            doc.thursday_morning = req.body.thursday_morning,
            doc.thursday_afternoon = req.body.thursday_afternoon,
            doc.friday_morning= req.body.friday_morning,
            doc.friday_afternoon= req.body.friday_afternoon,
            doc.day_off= req.body.day_off,
            doc.day_on= req.body.day_on

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