'use strict';

angular.module('bumper')
  .service('Auth', function ($rootScope, $cookieStore, $q, $http, $location) {

    var _user = {};

    if ($cookieStore.get('token')) {
      $http.get('/api/users/me')
        .then(function (res) {
          _user = res.data;
          if ($location.path() === '/') {
            $location.path('/dashboard');
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }

    /**
     * Logout
     */
    this.logout = function () {
      $cookieStore.remove('token');
      _user = {};
      $location.path('/');
    };

    /**
     * Check if user is logged
     *
     * @returns {boolean}
     */
    this.isLogged = function () {
      return _user.hasOwnProperty('_id');
    };

    /**
     * Returns the user
     *
     * @returns {object}
     */
    this.getUser = function () {
      return _user;
    };

    /**
     * Make a call to get the current user
     *
     * @returns {Promise}
     */
    this.getMe = function () {
      var deferred = $q.defer();
      $http.get('/api/users/me').then(function (res) {
        deferred.resolve(res.data);
      }, function (err) {
        deferred.reject(err.data);
      });
      return deferred.promise;
    };

  });
