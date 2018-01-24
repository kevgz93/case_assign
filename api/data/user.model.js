var mongoose = require('mongoose');

//defining schema for users table
var userSchema = new mongoose.Schema({
	name : String,
	lastName : String,
	username: String,
	password: String,
	email: String,
	city : String,
	time_zone: Number,
	sta_dyn: Number,
	max_case: Number,
	status: Boolean,
	activeSession: String,
	role: String,
	day_off: String,
	day_on: String,
	days_working: Number,
	last_case: String
});



//MODEL for Users using SCHEMA HOTELS

mongoose.model('user', userSchema, 'users')
