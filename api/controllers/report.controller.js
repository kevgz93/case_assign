var bitacora = require('../data/bitacora.model.js');
var ticketModel = require('../data/user.model.js');


var mongoose = require('mongoose');

var q = require('q');

var bita = {};

var bitacora = mongoose.model('bitacora');
var ticket = mongoose.model('case');

var ObjectId = mongoose.Schema.ObjectId;

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
  console.log(month);

  ticket.find({"date.month": month},function(err, rep) {
    console.log(rep);
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

bita.loadReportMonthAdded = function(month, case_status){
  var results = q.defer();

  ticket.find({'date.month': month, 'action':case_status}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

bita.loadReportMonthDeleted = function(month, case_status){
  var results = q.defer();

  ticket.find({'date.month': month, 'action':case_status}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

bita.loadReportEngSpecificAll = function(user){
  var results = q.defer();
  var query = {"engineer.engineer_id": user}

  ticket.find(query, function(err, rep) {
    console.log(rep);
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

bita.loadReportEngStatusSpecific = function(user, case_status)
{
  var results = q.defer();
  var engi = new ObjectId;
  engi = user;
  //var query = {"date.month": month,};
  //console.log(query);

  ticket.find({'engineer.engineer_id': user, 'action': case_status}, function(err, rep) {
    if (err){
      results.reject(err);
    }
    results.resolve(rep);
  });
  return results.promise;
}

bita.loadReportEngMonthSpecific = function(user, month)
{
  var results = q.defer();
  var engi = new ObjectId;
  engi = user;
  //var query = {"date.month": month,};
  //console.log(query);

  ticket.find({'engineer.engineer_id': user, 'date.month': month}, function(err, rep) {
    if (err){
      results.reject(err);
    }
    results.resolve(rep);
  });
  return results.promise;
}

bita.loadReportEngMonthStatusSpecific = function(user, month, case_status)
{
  var results = q.defer();

  ticket.find({'engineer.engineer_id': user, 'date.month': month, 'action':case_status}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
}



bita.generateReports = function(req, res)
{  
  console.log(req.body);
  var user = req.body.user;
  var month = req.body.month;
  var case_status = req.body.case_status;

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
    console.log("entro al all status")
    var report = bita.loadReportAllStatus(case_status)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  // get report with different month only
  else if(user === 'all' && month!= 'all' && case_status==='all')
  {
    console.log("entro al month all")
    var report = bita.loadReportMonthAll(month)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  // get report with different month and added status
  else if(user === 'all' && month!= 'all' && case_status=='added')
  {
    console.log("entro al month added")
    var report = bita.loadReportMonthAdded(month, case_status)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  // get report with different month and deleted status
  else if(user === 'all' && month!= 'all' && case_status=='deleted')
  {
    console.log("entro al month deleted")
    var report = bita.loadReportMonthDeleted(month, case_status)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  // get report with different user only
  else if(user != 'all' && month=== 'all' && case_status==='all')
  {
    console.log("entro al engineer all")
    var report = bita.loadReportEngSpecificAll(user)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  //Get report with specific user and status
  else if(user != 'all' && month=== 'all' && case_status!='all')
  {
    console.log("entro al engineer month")
    var report = bita.loadReportEngStatusSpecific(user, case_status)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  // get report with different user and month
  else if(user != 'all' && month!= 'all' && case_status==='all')
  {
    console.log("entro al engineer month")
    var report = bita.loadReportEngMonthSpecific(user, month)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  // get report with different user, month and status
  else
  {
    console.log("entro al engineer month and action")
    var report = bita.loadReportEngMonthStatusSpecific(user, month, case_status)
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
