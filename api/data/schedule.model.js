var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var user = new ObjectId;
//defining schema for users table
var scheduleSchema = new mongoose.Schema({
    monday : String,
    tuesday: String,
    wednesday: String,
	thursday : String,
    friday: String,
    user_id: user
});



//MODEL for Users using SCHEMA HOTELS

mongoose.model('schedule', scheduleSchema, 'schedules')