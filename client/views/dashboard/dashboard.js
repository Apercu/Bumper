'use strict';

angular.module('bumper')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'views/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'vm',
        authenticate: true,
        resolve: {
          repos: function (Repo) {
            return Repo.getBumperRepos();
          }
        }
      });
  });
