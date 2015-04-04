'use strict';

angular.module('bumper', [
  'ngRoute',
  'ngCookies',
  'ngAnimate'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

  })
  .factory('authInterceptor',
  function ($rootScope, $q, $cookieStore) {
    return {

      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      responseError: function (response) {
        if (response.status === 401) {
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

    };
  })

  .run(function ($rootScope, $location, Auth) {

    $rootScope.Auth = Auth;

    $rootScope.rootUi = {
      navBar: false
    };

    $rootScope.$on('$routeChangeStart', function (event, next) {
      if (next.authenticate) {
        Auth.getMe().catch(function () {
          $location.path('/');
        });
      }
    });

    $rootScope.$on('$routeChangeSuccess', function (e, route) {
      $rootScope.rootUi.navBar = route.$$route.navBar === undefined;
    });

  });
