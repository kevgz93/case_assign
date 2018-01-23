angular.module('myproject', ['ngRoute']).config(config);

function config($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'index.html',
      //controller: HotelsController,
      //controllerAs:'vmHotels' //view model
      /*
    }).when('/login', {
      templateUrl: 'angular-app/hotel-login/login.html',
      //controller: LoginController,
      //controllerAs:'vmUserController' //view model
    }).when('/admin', {
      templateUrl: 'angular-app/Nav-bar/navbar.html',
      //controller: LoginController,
      //controllerAs:'vmUserController' //view model
    })
    .when('/mantenimiento/users', {
      templateUrl: 'angular-app/Mantenimiento/users.html',
      //controller: LoginController,
      //controllerAs:'vmUserController' //view model
    })
    .when('/login/register', {
      templateUrl: 'angular-app/hotel-login/register.html',

    }).when('/mantenimiento/hotels', {
      templateUrl: 'angular-app/Mantenimiento/Mhotels.html',
    })
    .when('/hotels', {
      templateUrl: 'angular-app/hotel-list/hotels.html',
      //controller: HotelsController,
      //controllerAs:'vmHotels' //view model
    })
    .when('/hotel/:id', {
      templateUrl: 'angular-app/hotel-display/hotel.html',
      controller:HotelController,
      controllerAs: 'vmHotel'
    });
    */
}
