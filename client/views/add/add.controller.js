'use strict';

angular.module('bumper')
  .controller('AddCtrl', function (Repo) {

    var vm = this;

    angular.extend(vm, {

      ui: {
        fetching: true
      },

      githubRepos: [],

      fetch: function () {

        vm.ui.loading = true;

        Repo.getGithubRepos()
          .then(function (repos) { vm.githubRepos = repos; })
          .catch(function (err) { console.log(err); })
          .finally(function () {
            vm.ui.loading = false;
            vm.ui.fetching = false;
          });
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

    this.fetch();

  });
