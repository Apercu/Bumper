'use strict';

angular.module('bumper')
  .directive('notifs', function ($timeout, Alert) {
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
        }

        $timeout(function () {
          Alert.add('Coucou');
        }, 1000);

        $timeout(function () {
          Alert.add('Coucou', 'warning');
        }, 2000);

        $timeout(function () {
          Alert.add('Coucou', 'error');
        }, 3000);

      }
    };
  });
