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
  .route('/engineers')
  .get(ctrlUsers.getUsersWithNamesOnly);

  router
  .route('/check')
  .get(ctrlUsers.getUserBySessionId);

router
.route('/ticket/')
.get(helpers.isAuthenticated, ctrlTicket.loadEnginner) //helpers.isAuthenticated,
.post(ctrlTicket.addTicket)
.put(ctrlTicket.ticketDelete);

router
.route('/reports')
.post(ctrlReport.generateReports)

router
<<<<<<< HEAD
.route('/rotation')
.get(ctrlRotation.findWeek)
.post(ctrlRotation.createRotation)
.put(ctrlRotation.updateRotation)
=======
.route('/rotation/')
.get(ctrlRotation.getRotationByWeek) //helpers.isAuthenticated,
.post(ctrlRotation.createRotation)
.put(ctrlRotation.updateRotation);

router
.route('/checkrotation/')
.get(ctrlRotation.getRotationByStatus) //helpers.isAuthenticated,

>>>>>>> ea06745192972ade1d00c861ccdd8a41fa4f77a1


module.exports = router;
