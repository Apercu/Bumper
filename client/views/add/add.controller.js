'use strict';

angular.module('bumper')
  .controller('AddCtrl', function (Repo) {

    var vm = this;

    angular.extend(vm, {

      githubRepos: [],
      bumberRepos: [],

      addRepo: function (repo) {
        Repo.addFromGithub(repo)
          .then(function (repo) {
            vm.bumberRepos.push(repo);
          })
          .catch(function (err) { console.log(err); });
      },

      removeRepo: function (repo) {
        Repo.remove(repo)
          .then(function () { vm.bumberRepos.splice(vm.bumberRepos.indexOf(repo), 1); })
          .catch(function (err) { console.log(err); });
      }

    });

    Repo.getGithubRepos()
      .then(function (repos) { vm.githubRepos = repos; })
      .catch(function (err) { console.log(err); });

    Repo.getBumperRepos()
      .then(function (repos) { vm.bumberRepos = repos; })
      .catch(function (err) { console.log(err); });

  });
