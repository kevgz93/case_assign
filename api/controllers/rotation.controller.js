var rotationModel = require('../data/rotation.model.js');
var mongoose = require('mongoose');
var q = require('q');

var db = mongoose.model('rotation');
var rotation = {};


rotation.createRotation = function (req, res) {
    console.log(req.body.user_id);

    if(!req.body.monday.morning)
    {
        res.status(400);
        res.send({status:'error',error:'Values missing.'});
    }

    db.create({ 
        monday:{
            morning : req.body.monday.morning,
            afternoon: req.body.monday.afternoon,
            emea: req.body.monday.emea
        },
        tuesday: {
            morning : req.body.tuesday.morning,
            afternoon: req.body.tuesday.afternoon,
            emea: req.body.tuesday.emea
        },
        wednesday:{
            morning : req.body.wednesday.morning,
            afternoon: req.body.wednesday.afternoon,
            emea: req.body.wednesday.emea
        },
        thursday:{
            morning : req.body.thursday.morning,
            afternoon: req.body.thursday.afternoon,
            emea: req.body.thursday.emea
        },
        friday:{
            morning : req.body.friday.morning,
            afternoon: req.body.friday.afternoon,
            emea: req.body.friday.emea
        },
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
        if (week != 6){
        auxWeek = week +1;
        //console.log("nuevo week",auxWeek);
        rotation.updateStatusOnWeek(auxWeek, day);
    }
    else {
        auxWeek = 1;
        rotation.updateStatusOnWeek(auxWeek, day);
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

rotation.updateStatusOnWeek = function(week, day) {

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
            doc.active.day = day,
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
            doc.monday.morning = req.body.monday.morning,
            doc.monday.afternoon = req.body.monday.afternoon,
            doc.monday.emea = req.body.monday.emea,
            doc.tuesday.morning= req.body.tuesday.morning,
            doc.tuesday.afternoon= req.body.tuesday.afternoon,
            doc.tuesday.emea = req.body.tuesday.emea,
            doc.wednesday.morning= req.body.wednesday.morning,
            doc.wednesday.afternoon= req.body.wednesday.afternoon,
            doc.wednesday.emea = req.body.wednesday.emea,
            doc.thursday.morning = req.body.thursday.morning,
            doc.thursday.afternoon = req.body.thursday.afternoon,
            doc.thursday.emea = req.body.thursday.emea,
            doc.friday.morning= req.body.friday.morning,
            doc.friday.afternoon= req.body.friday.afternoon,
            doc.friday.emea = req.body.friday.emea,
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