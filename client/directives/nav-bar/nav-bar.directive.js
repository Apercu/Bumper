'use strict';

angular.module('bumper')
  .directive('navBar', function ($window) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/nav-bar/nav-bar.html',
      link: function (scope) {

        scope.nav = {
          redirecting: false
        };

        scope.login = function () {
          scope.nav.redirecting = true;
          $window.location.href = '/auth/github';
        };

      }
    };
  });
