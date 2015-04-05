'use strict';

angular.module('bumper')
  .controller('HomeCtrl', function ($window, $location, Auth) {

    var vm = this;

    angular.extend(vm, {
      authenticating: false,
      loading: true,
      login: function () {
        if (vm.authenticating) { return; }
        vm.authenticating = true;
        $window.location.href = '/auth/github';
      }
    });

    Auth.getMe()
      .then(function () { $location.path('/dashboard'); })
      .finally(function () {
        vm.loading = false;
      });
  });
