var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var engi = new ObjectId;
//defining schema for users table
var rotationSchema = new mongoose.Schema({
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
    week: Number,
    active: {
        status: Boolean,
        day: Number,
    } 
});


//MODEL for Users using SCHEMA HOTELS

mongoose.model('rotation', rotationSchema, 'rotations')