'use strict';

angular.module('bumper')
  .service('Repo', function ($http, $q) {

    angular.extend(this, {

      /**
       * Add a github repo to bumper
       * Returns the newly created bumper repo
       *
       * @param githubRepo
       * @returns {Promise}
       */
      addGithubRepo: function (githubRepo) {
        var def = $q.defer();
        $http.post('/api/repos', githubRepo)
          .then(function (res) { def.resolve(res.data); })
          .catch(function (err) { def.reject(err.data); });
        return def.promise;
      },

      /**
       * Retrieve all bumper repos of a user
       *
       * @returns {Promise}
       */
      getBumperRepos: function () {
        var def = $q.defer();
        $http.get('/api/repos')
          .then(function (res) {
            def.resolve(res.data);
          }, function (err) {
            def.reject(err.data);
          });
        return def.promise;
      },

      /**
       * Un-bumb a repo
       *
       * @param repo
       * @returns {Promise}
       */
      destroy: function (repo) {
        var def = $q.defer();
        $http.delete('/api/repos/' + repo._id)
          .then(function () { def.resolve(); })
          .catch(function (err) { def.reject(err); });
        return def.promise;
      }

    });

  });
