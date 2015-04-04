'use strict';

angular.module('bumper')
  .service('Alert', function () {

    var _alerts = [];

    angular.extend(this, {

      /**
       * Create a new alert
       *
       * @param msg {String}
       * @param type {String} ['warning', 'error', 'default']
       */
      add: function (msg, type) {
        if (!msg) { return; }
        _alerts.unshift({ msg: msg, type: type || 'default' });
      },

      /**
       * Get all current alerts
       *
       * @returns {Array}
       */
      get: function () {
        return _alerts;
      },

      /**
       * Remove the alert
       *
       * @param alert
       */
      remove: function (alert) {
        _alerts.splice(_alerts.indexOf(alert), 1);
      }

    });

  });
