'use strict';

angular.module('bumper')
  .animation('.overlay', function () {
    return {

      addClass: function (element, className, done) {
        var t = new TimelineMax();

        var loader = element[0].children[0];
        var text = element[0].children[0].children[1];

        var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        t
          .to(text, 0.25, { opacity: 0 })
          .to(loader, 1, { y: height })
          .to(element, 0.25, { opacity: 0 })
          .addCallback(done);
      },

      removeClass: function (element, className, done) {
        done();
      }

    };
  });
