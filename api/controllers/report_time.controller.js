var time_offModel = require('../data/time_off.model.js');


var mongoose = require('mongoose');
var time_off = mongoose.model('timeoff');

var q = require('q');

var report_time = {};

report_time.loadReportAll = function(){
	var results = q.defer();

  time_off.find({}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

  report_time.loadReportAllStatus = function(case_status){
  var results = q.defer();

  time_off.find({'action': case_status}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

  report_time.loadReportMonthAll = function(month){
  var results = q.defer();


  time_off.find({"day_off.month": month},function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

  report_time.loadReportMonthAdded = function(month, case_status){
  var results = q.defer();

  time_off.find({'day_off.month': month, 'action':case_status}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

  report_time.loadReportMonthDeleted = function(month, case_status){
  var results = q.defer();

  time_off.find({'day_off.month': month, 'action':case_status}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

  report_time.loadReportEngSpecificAll = function(user){
  var results = q.defer();
  var query = {"user_id": user}

  time_off.find(query, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
  }

  report_time.loadReportEngStatusSpecific = function(user, case_status)
{
  var results = q.defer();
  //var query = {"day_off.month": month,};
  //console.log(query);

  time_off.find({'user_id': user, 'action': case_status}, function(err, rep) {
    if (err){
      results.reject(err);
    }
    results.resolve(rep);
  });
  return results.promise;
}

report_time.loadReportEngMonthSpecific = function(user, month)
{
  var results = q.defer();
  //var query = {"day_off.month": month,};
  //console.log(query);

  time_off.find({'user_id': user, 'day_off.month': month}, function(err, rep) {
    if (err){
      results.reject(err);
    }
    results.resolve(rep);
  });
  return results.promise;

}

report_time.loadReportEngMonthStatusSpecific = function(user, month, case_status)
{
  var results = q.defer();


  time_off.find({'user_id': user, 'day_off.month': month, 'action':case_status}, function(err, rep) {
      if (err){
        results.reject(err);
      }
      results.resolve(rep);
    });
    return results.promise;
}



//main function

report_time.generateReports = function(req, res)
{  
  var user = req.body.user;
  var month = req.body.month;
  var time_off_status = req.body.time_off_status;

  //get report for all 
  if(user === "all" && month === "all" && time_off_status === "all")
  {
    var report = report_time.loadReportAll()
    report.then(function(reports){
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }
  // get report with different status only
  else if(user === 'all' && month=== 'all' && time_off_status!='all')
  {
    var report = report_time.loadReportAllStatus(time_off_status)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  // get report with different month only
  else if(user === 'all' && month!= 'all' && time_off_status==='all')
  {
    var report = report_time.loadReportMonthAll(month)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  // get report with different month and added status
  else if(user === 'all' && month!= 'all' && time_off_status=='added')
  {
    var report = report_time.loadReportMonthAdded(month, time_off_status)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  // get report with different month and deleted status
  else if(user === 'all' && month!= 'all' && time_off_status=='deleted')
  {
    var report = report_time.loadReportMonthDeleted(month, time_off_status)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  // get report with different user only
  else if(user != 'all' && month=== 'all' && time_off_status==='all')
  {
    var report = report_time.loadReportEngSpecificAll(user)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  //Get report with specific user and status
  else if(user != 'all' && month=== 'all' && time_off_status!='all')
  {
    var report = report_time.loadReportEngStatusSpecific(user, time_off_status)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }

  // get report with different user and month
  else if(user != 'all' && month!= 'all' && time_off_status==='all')
  {
    var report = report_time.loadReportEngMonthSpecific(user, month)
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
    var report = report_time.loadReportEngMonthStatusSpecific(user, month, time_off_status)
    report.then(function(reports){
      //console.log(engineers);
      res.send(reports);
      return;
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  }
}

module.exports = report_time;