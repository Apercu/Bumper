'use strict';

angular.module('bumper')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/b/:user/:repo', {
        templateUrl: 'views/bump/bump.html',
        controller: 'BumpCtrl',
        controllerAs: 'vm',
        authenticate: true,
        resolve: {
          repo: function (Repo, $route) { return Repo.get($route.current.params.user, $route.current.params.repo); }
        }
      });
  });
