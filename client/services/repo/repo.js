'use strict';

angular.module('bumper')
  .service('Repo', function ($http, $q) {

    angular.extend(this, {

      /**
       * Add a github repo to bumber
       * Returns the newly created bumber repo
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
      }

    });

  });
