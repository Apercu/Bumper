'use strict';

angular.module('bumper')
  .controller('DashboardCtrl', function (Repo) {

    var vm = this;

    angular.extend(vm, {
      loading: true
    });

    Repo.getBumperRepos().then(function (repos) {
      vm.repos = repos;
      vm.loading = false;
    });

  });
