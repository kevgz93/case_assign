var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var user = new ObjectId;
//defining schema for users table
var scheduleSchema = new mongoose.Schema({
    user_id: user,
    monday : String,
    tuesday: String,
    wednesday: String,
	thursday : String,
    friday: String,
});



//MODEL for Users using SCHEMA HOTELS

mongoose.model('schedule', scheduleSchema, 'schedules')