'use strict';

angular.module('bumper')
  .animation('.overlay', function () {
    return {

      addClass: function (element, className, done) {
        var t = new TimelineMax();

        var loader = element[0].children[0];
        var text = element[0].children[0].children[1];

        t
          .to(text, 0.5, { opacity: 0 })
          .to(loader, 0.5, { x: text.offsetWidth / 2 + 10 })
          .to(loader, 0.5, { y: 200, opacity: 0, ease: 'Back.easeIn' })
          .to(element, 0.25, { opacity: 0 })
          .addCallback(done);

      }

    };
  });
