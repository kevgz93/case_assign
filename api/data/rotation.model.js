var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var engi = new ObjectId;
//defining schema for users table
var calendarSchema = new mongoose.Schema({
    monday_morning : {day:String, user:engi},
    monday_afternoon : {day:String, user:engi},
    tuesday_morning: {day:String, user:engi},
    tuesday_afternoon: {day:String, user:engi},
    wednesday_morning: {day:String, user:engi},
    wednesday_afternoon: {day:String, user:engi},
    thursday_morning : {day:String, user:engi},
    thursday_afternoon : {day:String, user:engi},
    friday_morning: {day:String, user:engi},
    friday_afternoon: {day:String, user:engi},
    week: Number
});


//MODEL for Users using SCHEMA HOTELS

mongoose.model('rotation', rotationSchema, 'rotations')