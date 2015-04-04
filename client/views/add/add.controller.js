'use strict';

angular.module('bumper')
  .controller('AddCtrl', function (Repo) {

    var vm = this;

    angular.extend(vm, {

      ui: {
        fetching: false,
        loading: true
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
        Repo.addFromGithub(repo)
          .then(function (rep) {
            repo.addedToBumper = true;
            repo.bumperId = rep._id;
          })
          .catch(function (err) { console.log(err); });
      },

      removeRepo: function (repo) {
        Repo.remove(repo.bumperId)
          .then(function () {
            repo.addedToBumper = false;
            repo.bumperId = null;
          })
          .catch(function (err) { console.log(err); });
      }

    });

    Repo.getGithubRepos()
      .then(function (repos) { vm.githubRepos = repos; })
      .catch(function (err) { console.log(err); })
      .finally(function () { vm.ui.loading = false; });

  });
