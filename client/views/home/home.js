'use strict';

angular.module('bumper')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'vm',
        resolve: {
          repos: function ($q, $http) {

            var deferred = $q.defer();

            $http.get('/api/repos').then(function (res) {
              deferred.resolve(res.data);
            }, function (err) {
              deferred.reject(err);
            });

            return deferred.promise;
          }
        }
      });
  });
