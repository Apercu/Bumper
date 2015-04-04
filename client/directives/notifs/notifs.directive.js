'use strict';

angular.module('bumper')
  .directive('notifs', function (Alert) {
    return {
      restrict: 'EA',
      templateUrl: 'directives/notifs/notifs.html',
      link: function (scope) {

        scope.flashClass = {
          default: '',
          warning: 'flash-warn',
          error: 'flash-error'
        };

        scope.iconClass = {
          default: 'octicon-info',
          warning: 'octicon-issue-opened',
          error: 'octicon-alert'
        };

        scope.notifs = Alert.get();

        scope.remove = function (alert) {
          Alert.remove(alert);
        };

      }
    };
  });
