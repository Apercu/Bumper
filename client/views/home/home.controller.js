'use strict';

angular.module('bumper')
  .controller('HomeCtrl', function ($window) {

    var vm = this;

    angular.extend(vm, {
      authenticating: false,
      login: function () {
        if (vm.authenticating) { return; }
        vm.authenticating = true;
        $window.location.href = '/auth/github';
      }
    });

  });
