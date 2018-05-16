var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
//var engi = new ObjectId;
//defining schema for users table
var rotationSchema = new mongoose.Schema({
    monday : {
        morning:String,
        afternoon:String,
        emea: String
    },
    tuesday: {
        morning: String,
        afternoon: String,
        emea: String
    } ,
    tuesday:{
        morning: String,
        afternoon: String,
        emea: String
    },
    wednesday:{
        morning: String,
        afternoon: String,
        emea: String
    },
    
    thursday : {
        morning: String,
        afternoon: String,
        emea: String
    },
    friday : {
        morning: String,
        afternoon: String,
        emea: String
    },
    week: Number,
    active: {
        status: Boolean,
        day: Number,
    }
});


//MODEL for Users using SCHEMA HOTELS

mongoose.model('rotation', rotationSchema, 'rotations')