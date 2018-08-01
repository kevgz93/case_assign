var express = require('express');
var router = express.Router();
var helpers = require('../helper/helperFunctions');


var ctrlTicket = require('../controllers/ticket.controller.js');
var ctrlUsers = require('../controllers/user.controller.js');
var ctrlReport_case = require('../controllers/report_case.controller.js');
var ctrlReport_time = require('../controllers/report_time.controller.js');
var ctrlTime_off = require('../controllers/time_off.controller.js');
var ctrlSchedule = require('../controllers/schedule.controller.js');
var ctrlRotation = require('../controllers/rotation.controller.js');
var ctrlCaseAverage = require('../controllers/working_days.controller.js');

let weekendRotationCtrl = require ('../controllers/weekendRotation.controller');


router
  .route('/login/register')
  .post(helpers.isAdmin,ctrlUsers.register);

router
  .route('/checksession')
  .get(ctrlUsers.getBySessionId);

router
  .route('/login/schedule')
  .post(ctrlSchedule.createSchedule);

router
  .route('/schedule')
  .get(ctrlSchedule.getScheduleId)
  .post(helpers.isAdmin,ctrlSchedule.createSchedule)
  .put(helpers.isAdmin, ctrlSchedule.updateSchedule);
  

router
  .route('/login')
  .post(ctrlUsers.auth);

  router
  .route('/logout')
  .post(ctrlUsers.logout);

router
  .route('/user')
  .get(ctrlUsers.userGetOne)
  .put(ctrlUsers.usersUpdateOne)
  .delete(helpers.isAdmin,ctrlUsers.usersDeleteOne);// usersDeleteOne

router
    .route('/user/editWeekendRotationDates')
    .put(helpers.isAdmin, ctrlUsers.updateWRDates);

  router
  .route('/getusers')
  .get(ctrlUsers.getUsersNamesAndScheduleId);

  router
  .route('/check')
  .get(ctrlUsers.getUserBySessionId);

router
.route('/ticket/')
.get( ctrlTicket.loadEnginner) //helpers.isAuthenticated,
.post(ctrlTicket.addTicket)
.put(ctrlTicket.ticketDelete);

router
.route('/reports/case')
.post(helpers.isAdmin,ctrlReport_case.generateReports)


router
.route('/reports/time')
.post(helpers.isAdmin,ctrlReport_time.generateReports)

router
.route('/timeoff')
.get(ctrlTime_off.getOneTime_off)
.post(ctrlTime_off.addTime_off)
.put(ctrlTime_off.updateTime_off)
.delete(helpers.isAdmin,ctrlTime_off.deleteTime_off);

router
.route('/timeoffs')
.get(ctrlTime_off.getUserAllTime_off)

router
.route('/caseaverage/')
.get(ctrlCaseAverage.newMonthStart)
.post(ctrlCaseAverage.updateWorkingDays)
.put(ctrlCaseAverage.endTimeoff)

router
.route('/rotation/')
.get(ctrlRotation.getRotationByWeek) //helpers.isAuthenticated,
.post(helpers.isAdmin,ctrlRotation.createRotation)
.put(helpers.isAdmin,ctrlRotation.updateRotation);

router
.route('/rotations/')
.get(ctrlRotation.getAllRotation) //helpers.isAuthenticated,


router
.route('/checkrotation/')
.get(ctrlRotation.getRotationByStatus);

router
.route('/updateday/')
.put(ctrlRotation.updateDayOnWeek)//helpers.isAuthenticated,


// weekendRotation routes
router
    .route('/weekendRotations/')
    .get(weekendRotationCtrl.getEntries); //helpers.isAuthenticated,

router
    .route('/editWeekendRotation/')
    .put(weekendRotationCtrl.editEntry); //helpers.isAuthenticated,

module.exports = router;
