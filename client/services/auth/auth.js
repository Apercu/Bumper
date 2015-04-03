'use strict';

angular.module('bumper')
  .service('Auth', function ($rootScope, $cookieStore, $q, $http) {

    var _user = {};

    if ($cookieStore.get('token')) {
      $http.get('/api/users/me')
        .then(function (res) {
          _user = res.data;
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

  });
