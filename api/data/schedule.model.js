var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var user = new ObjectId;
//defining schema for users table
var scheduleSchema = new mongoose.Schema({
    monday_morning : Number,
    monday_afternoon : Number,
    tuesday_morning: Number,
    tuesday_afternoon: Number,
    wednesday_morning: Number,
    wednesday_afternoon: Number,
    thursday_morning : Number,
    thursday_afternoon : Number,
    friday_morning: Number,
    friday_afternoon: Number,
    day_off: String,
    day_on : String,
    time_zone: Number,
    user_id: user
});


//MODEL for Users using SCHEMA HOTELS

mongoose.model('schedule', scheduleSchema, 'schedules')