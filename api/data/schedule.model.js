var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var user = new ObjectId;
//defining schema for users table
var scheduleSchema = new mongoose.Schema({
    monday_morning : String,
    monday_afternoon : String,
    tuesday_morning: String,
    tuesday_afternoon: String,
    wednesday_morning: String,
    wednesday_afternoon: String,
    thursday_morning : String,
    thursday_afternoon : String,
    friday_morning: String,
    friday_afternoon: String,
    day_off: String,
    day_on : String,
    user_id: user
});



//MODEL for Users using SCHEMA HOTELS

mongoose.model('schedule', scheduleSchema, 'schedules')