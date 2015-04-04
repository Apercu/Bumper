'use strict';

angular.module('bumper')
  .directive('notifs', function (Alert) {
    return {
      restrict: 'EA',
      templateUrl: 'directives/notifs/notifs.html',
      link: function (scope) {

        scope.notifs = Alert.getAlerts();

      }
    };
  });
