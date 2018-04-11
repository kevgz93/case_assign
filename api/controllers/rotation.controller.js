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
        week: req.body.week,
        status:req.body.status
    }, function(err, user) { //this will run when create is completed
      if(err) {
        console.log("Error creating a Schedule");
        res
          .status(400)
          .json(err);

      } else {
        console.log("Rotation week created");
        console.log(user);

        res
          .status(201)
          .json({status:201,user:user});

      }
  })
}

<<<<<<< HEAD
rotation.getScheduleByWeek = function(req, res){
    var rota = rotation.findWeek(req.query.week)
    rota.then(function(rotation){
    console.log(rotation);
        res.send({status: 200, body: rotation});
    }, function(){
        res.send({status: 404,error:'Error occured while fetching data from database.'});
    });

}

//Find the user and send it again to getUserBySessionID
rotation.findWeek = function(week){
    var results = q.defer();

    db.findOne({week: week},function(err, dbuser) {
=======
rotation.getRotationByWeek = function(req, res){
    var rotat = rotation.findWeek(req.query.week)
    rotat.then(function(rotati){
        console.log(rotati);
            res.send({status: 200, body: rotati});
        }, function(){
            res.send({status: 404,error:'Error occured while fetching data from database.'});
        });
    
    }
    
//Find the user and send it again to getUserBySessionID
rotation.findWeek = function(week){
    var results = q.defer();

    db.findOne({week: week},function(err, dbuser) {
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

rotation.getRotationByStatus = function(req, res){
    var rotat = rotation.findWeekByStatus()
    rotat.then(function(rotati){
        console.log(rotati);
            res.send({status: 200, body: rotati.week});
        }, function(){
            res.send({status: 404,error:'Error occured while fetching data from database.'});
        });
    
    }
    
//Find the user and send it again to getUserBySessionID
rotation.findWeekByStatus = function(){
    var results = q.defer();

    db.findOne({status: true},function(err, dbuser) {
>>>>>>> ea06745192972ade1d00c861ccdd8a41fa4f77a1
        if (dbuser){
        results.resolve(dbuser);

    }  else{
            var response = {};
            response.status = 'error';
<<<<<<< HEAD
            response.error = 'Rotation week not found it';
=======
            response.error = 'Schedule not found it';
>>>>>>> ea06745192972ade1d00c861ccdd8a41fa4f77a1
            results.resolve(response);
        }
    });

    return results.promise;
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
<<<<<<< HEAD
            console.log("Error finding user");
=======
            console.log("Error finding week");
>>>>>>> ea06745192972ade1d00c861ccdd8a41fa4f77a1
            response.status = 500;
            response.message = err;
        } else if(!doc){
            response.status= 404;
            response.message = {
<<<<<<< HEAD
            "message":"User ID not found"
=======
            "message":"week not found"
>>>>>>> ea06745192972ade1d00c861ccdd8a41fa4f77a1
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
<<<<<<< HEAD
            doc.friday_afternoon= req.body.friday_afternoon
=======
            doc.friday_afternoon= req.body.friday_afternoon,
            doc.status = req.body.status
>>>>>>> ea06745192972ade1d00c861ccdd8a41fa4f77a1

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