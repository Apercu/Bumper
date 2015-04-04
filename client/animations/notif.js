'use strict';

angular.module('bumper')
  .animation('.notif', function () {
    return {

      enter: function (element, done) {

        var t = new TimelineMax();

        var h = element[0].clientHeight;

        t
          .set(element, { height: 0, y: -100, opacity: 0, ease: 'Back.easeIn' })
          .to(element, 0.5, { height: h, y: 0, opacity: 1 })
          .addCallback(done);

      },

      leave: function (element, done) {

        var t = new TimelineMax();

        t
          .to(element, 0.5, { opacity: 0 })
          .to(element, 0.25, { height: 0, padding: 0 })
          .addCallback(done);

      }

    };
  });
