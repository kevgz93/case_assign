
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var engi = new ObjectId;
var user = new ObjectId;

//defining schema for users table
var caseSchema = new mongoose.Schema({
	user_id: user,
	action: String,
	date: {
		day: Number,
		month: Number,
		year: Number
	},
	time: String,
	engineer_id: engi,
	});
//MODEL for Users using SCHEMA Engineer

mongoose.model('case', caseSchema, 'cases')
