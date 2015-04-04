'use strict';

angular.module('bumper')
  .controller('AddCtrl', function (Repo) {

    var vm = this;

    angular.extend(vm, {

      githubRepos: [],
      bumperRepos: [],

      addRepo: function (repo) {
        Repo.addFromGithub(repo)
          .then(function (repo) {
            vm.bumperRepos.push(repo);
          })
          .catch(function (err) { console.log(err); });
      },

      removeRepo: function (repo) {
        Repo.remove(repo)
          .then(function () { vm.bumperRepos.splice(vm.bumperRepos.indexOf(repo), 1); })
          .catch(function (err) { console.log(err); });
      }

    });

    Repo.getGithubRepos()
      .then(function (repos) { vm.githubRepos = repos; })
      .catch(function (err) { console.log(err); });

    Repo.getBumperRepos()
      .then(function (repos) { vm.bumperRepos = repos; })
      .catch(function (err) { console.log(err); });

  });
