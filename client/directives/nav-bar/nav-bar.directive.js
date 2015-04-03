'use strict';

angular.module('bumper')
  .directive('navBar', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/nav-bar/nav-bar.html'
    };
  });
