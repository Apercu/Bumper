'use strict';

angular.module('bumper')
  .service('Alert', function () {

    var _alerts = [];

    angular.extend(this, {

      /**
       * Create a new alert
       *
       * @param msg
       */
      addAlert: function (msg) {
        _alerts.push({ msg: msg });
      },

      /**
       * Get all current alerts
       *
       * @returns {Array}
       */
      getAlerts: function () {
        return _alerts;
      }

    });

  });
