var mongoose = require('mongoose');

//defining schema for users table
var bitacoraSchema = new mongoose.Schema({
		id_engineer : String,
		name: String,
		last: String,
    period : String,
		action: String,
		user: String
});


//MODEL for Users using SCHEMA HOTELS

mongoose.model('bitacora',bitacoraSchema, 'bitacoras')
