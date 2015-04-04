'use strict';

angular.module('bumper')
  .controller('DashboardCtrl', function (bumperRepos) {

    var vm = this;

    angular.extend(vm, {
      repos: bumperRepos
    });

  });
