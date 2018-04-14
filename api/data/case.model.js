
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var engi = new ObjectId;
var user = new ObjectId;

//defining schema for users table
var caseSchema = new mongoose.Schema({
	user: {
		user_id:user,
		user_name:String,
		user_last_name:String
	},
	action: String,
	date: {
		day: Number,
		date: Number,
		month: Number,
		year: Number
	},
	time: String,
	engineer: {
		engineer_id:engi,
		engi_name:String,
		engi_last_name:String
	}
	});
//MODEL for Users using SCHEMA Engineer

mongoose.model('case', caseSchema, 'cases')
