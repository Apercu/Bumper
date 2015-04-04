'use strict';

angular.module('bumper')
  .controller('HomeCtrl', function (repos) {

    var vm = this;

    angular.extend(vm, {
      repos: repos
    });

  });
