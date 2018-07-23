var mongoose = require('mongoose');

//defining schema for users table
var userSchema = new mongoose.Schema({
	name : String,
	last_name : String,
	username: String,
	password: String,
	email: String,
	city : String,
	sta_dyn: Number,
	max_case: Number,
	status: Boolean,
	activeSession: String,
	role: String,
	working_days: {
		current_days : Number,
		next_month : Number,
		status:Boolean,
		dayoff:Number,
	},
	last_case: String,
	weekendRotationDates: [{ date: Date }]
});



//MODEL for Users using SCHEMA HOTELS

mongoose.model('user', userSchema, 'users');