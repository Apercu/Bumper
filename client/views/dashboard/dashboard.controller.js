'use strict';

angular.module('bumper')
  .controller('DashboardCtrl', function (Repo) {

    var vm = this;

    angular.extend(vm, {

    });

    Repo.getBumperRepos().then(function (repos) {
      vm.repos = repos;
    });

  });
