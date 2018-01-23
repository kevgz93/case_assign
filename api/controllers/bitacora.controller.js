var bitacora = require('../data/bitacora.model.js');
var userModel = require('../data/user.model.js');


var mongoose = require('mongoose');

var q = require('q');

var bita = {};

var bitacora = mongoose.model('bitacora');
var user = mongoose.model('user');



var jso = [];

bita.loadReportAll = function(){
	var results = q.defer();

  bitacora.find({}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
      console.log(rep);
    });
    return results.promise;
  }

bita.loadReportDate = function(period){
	var results = q.defer();

  bitacora.find({period: period}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

bita.loadReportEngDate = function(name, last, period){
	var results = q.defer();

  bitacora.find({name: name, last: last, period: period}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

bita.loadReportEng = function(name, last)
{
  var results = q.defer();

  bitacora.find({name: name, last: last}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
}



bita.generateReports = function(req, res)
{
  var name = req.body.name;
  var last = req.body.last;
  var date = req.body.date;
  var choose = req.body.choose;

  if(choose === "all")
  {
    console.log("entro al all ")
    var report = bita.loadReportAll()
    report.then(function(reports){
      console.log(reports);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }
  else if(name === 'null' && date!= 'null')
  {
    console.log("entro al date")
    var report = bita.loadReportDate(date)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }
  else if(name != 'null' && date === 'null')
  {
    console.log("entro al engineer")
    var report = bita.loadReportEng(name, last)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }
  else {
    {
      console.log("entro al engi and date")
      var report = bita.loadReportEngDate(name, last, date)
      report.then(function(reports){
        //console.log(engineers);
        res.send(reports);
        return;
      }, function(){
        res.send({status:'error',error:'Error occured while fetching data from database.'});
      });
    }
  }
}

bita.addBitacora = function(sessionId, action, id_engi, name, last)
{
  var date = new Date();
  fecha = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
  console.log("Entro a la bitacora " +sessionId+action+id_engi+name+last);
  var users = bita.findUser(sessionId)
  users.then(function(user){
    bitacora.create({
        id_engineer : id_engi,
    		name: name,
    		last: last,
        period : fecha,
    		action: action,
        user: user.name + " " + user.lastName
      }, function(err, bita) { //this will run when create is completed
        if(err) {
          console.log("Error creating a Bitacora Line");
          jso.push(sessionID);
          jso.push(action);
          jso.push(id_engi);
          jso.push(name);
          jso.push(last);
          console.log(jso);

        } else {
          console.log("Bitacora created");
          console.log(bita);

        }
      });
  }, function(){
    res.send({status:'error',error:'Error occured while fetching data from database.'});
  });
}


bita.findUser = function(sessionId){
  var results = q.defer();

  user.findOne({activeSession: sessionId},function(err, dbuser) {
    if (err){
      results.reject(err);
    }
    results.resolve(dbuser);
  });

  return results.promise;
}

module.exports = bita;
