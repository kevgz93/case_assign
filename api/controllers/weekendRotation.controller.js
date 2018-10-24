// Required variables
// let weekendRotationModel = require('../data/weekendRotation.model');
let mongoose = require('mongoose');
let q = require('q');
let db = mongoose.model('user');

// Create the controller object
let weekendRotation = {};

/*
  * ******************** *
  * Controller functions *
  * ******************** *
*/

// Function getWeekendRotations
// Description:  List all the weekend rotations
weekendRotation.getEntries = function(req, res){
    let weekendRotationFunction = getWeekendRotations();
    weekendRotationFunction.then(function(data){
        res.send({status: 200, body: data});
    }, function(){
        res.send({status: 404, error:'Error occured while fetching data from database.'});
    });
};

// Function editEntry
// Description:  Edit the WeekendRotationDates for a specific user.
weekendRotation.editEntry = function (req, res) {
    if(!req.body.userId && !req.body.weekendRotationDates){
        res.status(400);
        res.send({status:'error',error:'Values missing.'});
    } else {
        db.findById("5b00a0cb2a84a50b984ca91f", function(err, user) {
            user.set({weekendRotationDates: req.body.weekendRotationDates});
            user.save(function(err, updatedUser){
                if(err) {
                    res.send({status:400, error:'Error editing the user entry'});
                } else {
                    res.send({status:200, user: updatedUser});
                }
            });
        });
    }
};


/*
  * ***************** *
  * Private functions *
  * ***************** *
*/

// Function getWeekendRotations
// Description:  Get all the weekend rotations from the db
let getWeekendRotations = function(){
    let results = q.defer();
    db.find({}, function(err, dbuser) {
        if (dbuser){
            results.resolve(dbuser);
        }  else{
            let response = {};
            response.status = 'error';
            response.error = 'Weekend Rotation not found';
            results.resolve(response);
        }
    }).select('_id name last_name username weekendRotationDates');

    return results.promise;
};

module.exports = weekendRotation;