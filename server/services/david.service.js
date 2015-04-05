'use strict';

var q = require('q');
var async = require('async');
var david = require('david');
var semver = require('semver');

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

exports.reduceDependencies = function (repo) {

  if (!repo.david) { return; }

  repo.david.deps = reduce(repo.david.deps);
  repo.david.devDeps = reduce(repo.david.devDeps);

  function reduce (deps) {
    var status = {
      upToDate: 0,
      quasiUpToDate: 0,
      outOfDate: 0,
      invalid: 0,
      nb: deps.length
    };
    deps.forEach(function (dep) {
      try {

        var required = semver.clean(dep.required.charAt(0) === '^' ? dep.required.substr(1) : dep.required);
        var latest = semver.clean(dep.latest);
        var stable = semver.clean(dep.stable);

        if (semver.gt(latest, required) && status < 3) { return ++status.quasiUpToDate; }
        if (semver.gt(stable, required)) { return ++status.outOfDate; }
        ++status.upToDate;

      } catch (e) {
        ++status.invalid;
      }
    });
    return status;
  }

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
