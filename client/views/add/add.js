'use strict';

angular.module('bumper')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/add', {
        templateUrl: 'views/add/add.html',
        controller: 'AddCtrl',
        controllerAs: 'vm'
      });
  });
