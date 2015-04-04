'use strict';

angular.module('bumper')
  .controller('AddCtrl', function (Repo) {

    var vm = this;

    angular.extend(vm, {

      ui: {
        fetching: false
      },

      githubRepos: [],

      fetch: function () {

        vm.ui.fetching = true;

        Repo.fetchGithubRepos()
          .then(function (repos) { vm.githubRepos = repos; })
          .catch(function (err) { console.log(err); })
          .finally(function () { vm.ui.fetching = false; });
      },

      addRepo: function (repo) {
        repo.adding = true;
        Repo.addFromGithub(repo)
          .then(function (rep) {
            repo.addedToBumper = true;
            repo.bumperId = rep._id;
          })
          .catch(function (err) { console.log(err); })
          .finally(function () { repo.adding = false; });
      },

      removeRepo: function (repo) {
        repo.removing = true;
        Repo.remove(repo.bumperId)
          .then(function () {
            repo.addedToBumper = false;
            repo.bumperId = null;
          })
          .catch(function (err) { console.log(err); })
          .finally(function () { repo.removing = false; });
      }

    });

    Repo.getGithubRepos()
      .then(function (repos) { vm.githubRepos = repos; })
      .catch(function (err) { console.log(err); })
      .finally(function () { vm.ui.fetching = false; });

  });
