'use strict';

angular.module('bumper')
  .controller('AddCtrl', function (Repo) {

    var vm = this;

    angular.extend(vm, {
    });

    Repo.getGithubRepos().then(function (repos) {
      vm.githubRepos = repos;
    });

  });
