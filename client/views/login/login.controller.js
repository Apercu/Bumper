'use strict';

angular.module('bumper')
  .controller('LoginCtrl', function ($window) {

    var vm = this;

    angular.extend(vm, {

      login: function () {
        $window.location.href= '/auth/github';
      }

    });

  });
