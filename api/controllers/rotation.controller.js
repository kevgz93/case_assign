var rotationModel = require('../data/rotation.model.js');
var mongoose = require('mongoose');
var q = require('q');

var db = mongoose.model('rotation');
var rotation = {};


rotation.createRotation = function (req, res) {
    console.log(req.body.user_id);

    if(!req.body.monday_morning)
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
        active: {
            status:req.body.status,
            day:req.body.day
        },
        week: req.body.week
    }, function(err, user) { //this will run when create is completed
      if(err) {
        console.log("Error creating a Rotation Calendar");
        res
          .status(400)
          .json(err);

      } else {
        console.log("Rotation Calendar created");
        console.log(user);

        res
          .status(201)
          .json({status:201,user:user});

      }
  })
}


//Get all rotation table
rotation.getAllRotation = function(req, res){
    var rotat = rotation.getRotation()
    rotat.then(function(rotati){
        console.log(rotati);
            res.send({status: 200, body: rotati});
        }, function(){
            res.send({status: 404,error:'Error occured while fetching data from database.'});
        });
    
    }

rotation.getRotation = function(week){
    var results = q.defer();

    db.find({},function(err, dbuser) {
        if (dbuser){
        results.resolve(dbuser);

    }  else{
            var response = {};
            response.status = 'error';
            response.error = 'Rotation not found it';
            results.resolve(response);
        }
    });

    return results.promise;
}


    
//Find the user and send it again to getUserBySessionID

rotation.getRotationByWeek = function(req, res){
    var rotat = rotation.findWeek(req.query.week)
    rotat.then(function(rotati){
        console.log(rotati);
            res.send({status: 200, body: rotati});
        }, function(){
            res.send({status: 404,error:'Error occured while fetching data from database.'});
        });
    
    }
rotation.findWeek = function(week){
    var results = q.defer();

    db.findOne({"week": week},function(err, dbuser) {
        if (dbuser){
        results.resolve(dbuser);

    }  else{
            var response = {};
            response.status = 'error';
            response.error = 'Week not found it';
            results.resolve(response);
        }
    });

    return results.promise;
}


    
//Find the current status getRotationByStatus


rotation.getRotationByStatus = function(req, res){
    var rotat = rotation.findWeekByStatus()
    rotat.then(function(rotati){
        console.log(rotati);
            res.send({status: 200, body: rotati});
        }, function(){
            res.send({status: 404,error:'Error occured while fetching data from database.'});
        });
    
    }
rotation.findWeekByStatus = function(){
    var results = q.defer();

    db.findOne({"active.status": true},function(err, dbuser) {
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

//update the day on the current week
rotation.updateDayOnWeek = function(req, res) {
    var day = req.body.day;
    var week = req.body.week;
    let auxWeek;
    if (week != 6){
        auxWeek = week +1;
        //console.log("nuevo week",auxWeek);
        rotation.updateStatusOnWeek(auxWeek);
    }
    else {
        auxWeek = 1;
        rotation.updateStatusOnWeek(auxWeek);
    }
console.log("Get week" + week);

    db
        .findOne({week : week})
        .exec(function(err, doc){
        var response = {
            status: 200,
            message: doc
        };

        if (err) {
            console.log("Error finding week");
            response.status = 500;
            response.message = err;
        } else if(!doc){
            response.status= 404;
            response.message = {
            "message":"week not found"
            };
        }

        if (response.status != 200) {
            res
            .status(response.status)
            .json(response.message);
        } else {
            doc.active.day = day,
            doc.active.status = false

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

rotation.updateStatusOnWeek = function(week) {

console.log("Get week" + week);

    db
        .findOne({week : week})
        .exec(function(err, doc){
        var response = {
            status: 200,
            message: doc
        };

        if (err) {
            console.log("Error finding week");
            response.status = 500;
            response.message = err;
        } else if(!doc){
            response.status= 404;
            response.message = {
            "message":"week not found"
            };
        }

        if (response.status != 200) {
            console.log(response);
        } else {
            doc.active.status = true

        };

        doc.save(function(err, Updated) {
            if (err) {
                console.log("Status saved", updated);

            } else {
                console.log("Status not saved");
            }
        });
    })
}

rotation.updateRotation = function (req, res) {

var week = req.body.week;
console.log("Get week" + week);

    db
        .findOne({week : week})
        .exec(function(err, doc){
        var response = {
            status: 200,
            message: doc
        };

        if (err) {
            console.log("Error finding week");
            response.status = 500;
            response.message = err;
        } else if(!doc){
            response.status= 404;
            response.message = {
            "message":"week not found"
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
            doc.status = req.body.status

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

module.exports = rotation;