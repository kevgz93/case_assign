var bitacora = require('../data/bitacora.model.js');
var ticketModel = require('../data/user.model.js');


var mongoose = require('mongoose');

var q = require('q');

var bita = {};

var bitacora = mongoose.model('bitacora');
var ticket = mongoose.model('case');



var jso = [];

bita.loadReportAll = function(){
	var results = q.defer();

  ticket.find({}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
      console.log(rep);
    });
    return results.promise;
  }

bita.loadReportAllStatus = function(case_status){
  var results = q.defer();

  ticket.find({'action': case_status}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
      console.log(rep);
    });
    return results.promise;
  }

bita.loadReportMonthAll = function(month){
	var results = q.defer();

  bitacora.find({'date.month': month}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

bita.loadReportMonthAdded = function(month, case_status){
  var results = q.defer();

  bitacora.find({'date.month': month, 'action':case_status}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

bita.loadReportMonthDelete = function(month, case_status){
  var results = q.defer();

  bitacora.find({'date.month': month, 'action':case_status}, function(err, rep) {
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
  var user = req.body.user;
  var month = req.body.month;
  var case_status = req.body.date;

  //get report for all 
  if(user === "all" && month === "all" && case_status === "all")
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
  // get report with different status only
  else if(user === 'all' && month=== 'all' && case_status!='all')
  {
    console.log("entro al date")
    var report = bita.loadReportAllStatus(case_status)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  // get report with different status only
  else if(user === 'all' && month!= 'all' && case_status==='all')
  {
    console.log("entro al date")
    var report = bita.loadReportMonthAll(month)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  else if(user === 'all' && month!= 'all' && case_status=='added')
  {
    console.log("entro al date")
    var report = bita.loadReportMonthAdded(month, case_status)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }
  else if(user === 'all' && month!= 'all' && case_status=='deleted')
  {
    console.log("entro al date")
    var report = bita.loadReportMonthDeleted(month, case_status)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  //then
  else if(user != 'all' && month=== 'all' && case_status==='all')
  {
    console.log("entro al engineer")
    var report = bita.loadReportEngSpecificAll(name, last)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }
  else if(user != 'all' && month!= 'all' && case_status==='all')
  {
    console.log("entro al engineer")
    var report = bita.loadReportEngMonthSpecific(name, last)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }
  else
  {
    console.log("entro al engineer")
    var report = bita.loadReportEngMonthStatusSpecific(name, last)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
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


module.exports = bita;
