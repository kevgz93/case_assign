var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/Queue';



mongoose.connect(dburl);

mongoose.connection.on('connected', function(){
  console.log('Mongoose connected to: ' + dburl);
});

mongoose.connection.on('disconnected', function(){
  console.log('Mongoose disconnected from: ' + dburl);
});

mongoose.connection.on('error', function(err){
  console.log('Mongoose connection error on: ' + dburl +'error: '+ err);
});

process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through app termination SIGINT');
    process.exit(0);
  });
});


process.on('SIGTERM', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through app termination SIGTERM');
    process.exit(0);
  });
});

process.once('SIGUSR2', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through app termination SIGUSR2');
    process.kill(process.pid, 'SIGUSR2');
  });
});


//BRING THE SCHEMAS AND MODELS HERE

require('./user.model.js');
require('./case.model.js');
require('./bitacora.model.js');
