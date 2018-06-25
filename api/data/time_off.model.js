
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var engi = new ObjectId;
var user = new ObjectId;

//defining schema for users table
var time_offSchema = new mongoose.Schema({
	user_id:user,
    day_off: {
        day:Number,
        month: Number,
        year:Number,
        hour:Number,
        minutes:Number
    },
    day_on : {
        day:Number,
        month: Number,
        year:Number,
        hour:Number,
        minutes:Number
	},
    action:String,
    reason:String,
    reason_delete_modify: String
	});
//MODEL for Users using SCHEMA Engineer

mongoose.model('timeoff', time_offSchema, 'timeoffs')
