'use strict';

angular.module('bumper')
  .controller('HomeCtrl', function ($window) {

    var vm = this;

    angular.extend(vm, {
      login: function () {
        $window.location.href = '/auth/github';
      }
    });

  });
