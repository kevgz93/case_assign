var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var user = new ObjectId;
//defining schema for users table
var scheduleSchema = new mongoose.Schema({
    monday_morning : {hour:Number,minutes:Number},
    monday_afternoon : {hour:Number,minutes:Number},
    tuesday_morning: {hour:Number,minutes:Number},
    tuesday_afternoon: {hour:Number,minutes:Number},
    wednesday_morning: {hour:Number,minutes:Number},
    wednesday_afternoon: {hour:Number,minutes:Number},
    thursday_morning : {hour:Number,minutes:Number},
    thursday_afternoon : {hour:Number,minutes:Number},
    friday_morning: {hour:Number,minutes:Number},
    friday_afternoon: {hour:Number,minutes:Number},
    day_off: {
        day:Number,
        month: Number,
        hour:Number,
        minutes:Number
    },
    day_on : {
        day:Number,
        month: Number,
        hour:Number,
        minutes:Number
    },
    time_zone: String,
    user_id: user
});


//MODEL for Users using SCHEMA HOTELS

mongoose.model('schedule', scheduleSchema, 'schedules')