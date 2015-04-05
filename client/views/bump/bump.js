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
          user: function ($location, $q, $route, Auth) {
            var def = $q.defer();
            Auth.getMe().then(function (user) {
              if (user.username !== $route.current.params.user) {
                def.reject({ msg: 'This is not your repo.' });
              }
              def.resolve(user);
            }, function (err) {
              def.reject(err);
            });
            return def.promise;
          }
        }
      });
  });
