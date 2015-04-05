'use strict';

angular.module('bumper')
  .controller('BumpCtrl', function (repo) {

    var vm = this;

    angular.extend(vm, {
      repo: repo
    });

  });
