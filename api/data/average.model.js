var mongoose = require('mongoose');
//defining schema for users table
var averageSchema = new mongoose.Schema({
    date : {day:Number,month:Number,year:Number},
    totalCases : Number,
    totalEngineers: Number,
    average: Number
});


//MODEL for Users using SCHEMA HOTELS

mongoose.model('average', averageSchema, 'averages')