'use strict';

var q = require('q');
var async = require('async');
var david = require('david');

exports.retrieveDependencies = function (repo) {

  var def = q.defer();
  var pkg = JSON.parse(repo.pkg);

  async.parallel([

    // get dependencies
    function (done) {
      david.getDependencies(pkg, function (err, deps) {
        if (err) { return done(err); }
        repo.david.deps = listDependencies(deps);
        done();
      });
    },

    // get dev-dependencies
    function (done) {
      david.getDependencies(pkg, {dev: true}, function (err, deps) {
        if (err) { return done(err); }
        repo.david.devDeps = listDependencies(deps);
        done();
      });
    }

  ], function (err) {
    if (err) { def.reject(err); }
    def.resolve();
  });

  return def.promise;

};

// utils

function listDependencies (deps) {
  var out = [];
  Object.keys(deps).forEach(function (depName) {
    out.push({
      name: depName,
      required: deps[depName].required || '*',
      stable: deps[depName].stable || 'None',
      latest: deps[depName].latest
    });
  });
  return out;
}
