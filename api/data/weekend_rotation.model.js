var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var engi = new ObjectId;

//defining schema for users table
var weekendRotatioSchema = new mongoose.Schema({
    userId: ObjectId,
    dates: Array
});


//MODEL for Users using SCHEMA HOTELS

mongoose.model('weekendRotation', weekendRotatioSchema, 'weekend_rotations')