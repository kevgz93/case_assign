let mongoose = require('mongoose');
let user = new  mongoose.Schema.ObjectId;

//defining schema for users table
let weekendRotationSchema = new mongoose.Schema({
    userId: user,
    dates: [
        { type: Date }
    ]
});


//MODEL for Weekend Rotation using SCHEMA HOTELS
mongoose.model('weekendRotation', weekendRotationSchema, 'weekendRotations')