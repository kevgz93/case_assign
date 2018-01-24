var express = require('express');
var router = express.Router();
var helpers = require('../helper/helperFunctions');


var ctrlTicket = require('../controllers/ticket.controller.js');
var ctrlUsers = require('../controllers/user.controller.js');
var ctrlBitacora = require('../controllers/bitacora.controller.js');
var ctrlSchedule = require('../controllers/schedule.controller.js');



router
  .route('/login/register')
  .post(ctrlUsers.register);

router
  .route('/login/schedule')
  .post(ctrlSchedule.createSchedule);

router
  .route('/schedule')
  .post(ctrlSchedule.getScheduleId)
  .put(ctrlSchedule.updateSchedule);
  

router
  .route('/login')
  .post(ctrlUsers.auth);

router
  .route('/user')
  .get(helpers.isAuthenticated, ctrlUsers.userGetOne)
  .put(helpers.isAuthenticated, ctrlUsers.usersUpdateOne)
  .delete(helpers.isAuthenticated, ctrlUsers.usersDeleteOne);

  router
  .route('/check')
  .get(ctrlUsers.loadUsers);

router
.route('/ticket')
.get(ctrlTicket.loadEnginner) //helpers.isAuthenticated,
.post(helpers.isAuthenticated, ctrlTicket.addTicket)
.put(helpers.isAuthenticated, ctrlTicket.ticketDelete)

router
.route('/reports')
.post(helpers.isAdmin, ctrlBitacora.generateReports)


/*
  router
    .route('/helper')
    .get(helpers.isAuthenticated)

router
  .route('/login')
  .post(ctrlUsers.auth);

  router
    .route('/user')
    .get(helpers.isAuthenticated, ctrlUsers.getUserBySessionId);

  router
    .route('/users')
    .get(helpers.isAuthenticated, ctrlUsers.getUser);

  router
    .route('/login/register')
    .post(ctrlUsers.register);

  router
    .route('/logout')
    .get(helpers.isAuthenticated, ctrlUsers.logout);

router
  .route('/hotels/:hotelId')
  .get(ctrlHotels.hotelsGetOne)
  .put(ctrlHotels.hotelsUpdateOne)
  .delete(helpers.isAuthenticated, ctrlHotels.hotelsDeleteOne);

  router
    .route('/users/:userId')
    .get(helpers.isAuthenticated, ctrlUsers.userGetOne)
    .put(helpers.isAuthenticated, ctrlUsers.usersUpdateOne)
    .delete(helpers.isAuthenticated, ctrlUsers.usersDeleteOne);


//REVIEWS ROUTES
  router
    .route('/hotels/:hotelId/reviews')
    .get(helpers.isAuthenticated, ctrlReviews.reviewsGetAll)
    .post(helpers.isAuthenticated, ctrlReviews.reviewsAddOne);

  router
    .route('/hotels/:hotelId/reviews/:reviewId')
    .delete(helpers.isAuthenticated, ctrlReviews.reviewsDeleteOne);
*/
module.exports = router;
