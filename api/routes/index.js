var express = require('express');
var router = express.Router();
var helpers = require('../helper/helperFunctions');


var ctrlTicket = require('../controllers/ticket.controller.js');
var ctrlUsers = require('../controllers/user.controller.js');
var ctrlReport = require('../controllers/report.controller.js');
var ctrlSchedule = require('../controllers/schedule.controller.js');
var ctrlRotation = require('../controllers/rotation.controller.js');



router
  .route('/login/register')
  .post(ctrlUsers.register);

router
  .route('/checksession')
  .get(ctrlUsers.getBySessionId);

router
  .route('/login/schedule')
  .post(ctrlSchedule.createSchedule);

router
  .route('/schedule')
  .get(ctrlSchedule.getScheduleId)
  .post(ctrlSchedule.createSchedule)
  .put(ctrlSchedule.updateSchedule);
  

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
  .delete(ctrlUsers.usersDeleteOne);

  router
  .route('/getusers')
  .get(ctrlUsers.getUsersWithNamesOnly);

  router
  .route('/check')
  .get(ctrlUsers.getUserBySessionId);

router
.route('/ticket/')
.get( ctrlTicket.loadEnginner) //helpers.isAuthenticated,
.post(ctrlTicket.addTicket)
.put(ctrlTicket.ticketDelete);

router
.route('/reports')
.post(ctrlReport.generateReports)

router
.route('/rotation/')
.get(ctrlRotation.getRotationByWeek) //helpers.isAuthenticated,
.post(ctrlRotation.createRotation)
.put(ctrlRotation.updateRotation);

router
.route('/rotations/')
.get(ctrlRotation.getAllRotation) //helpers.isAuthenticated,


router
.route('/checkrotation/')
.get(ctrlRotation.getRotationByStatus);

router
.route('/updateday/')
.put(ctrlRotation.updateDayOnWeek)//helpers.isAuthenticated,

router
.route('/timeoff/')
.put(ctrlSchedule.createTimeOff)//helpers.isAuthenticated,



module.exports = router;
