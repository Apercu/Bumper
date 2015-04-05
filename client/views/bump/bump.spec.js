'use strict';

describe('Controller: BumpCtrl', function () {

  beforeEach(module('bumper'));

  var BumpCtrl;

  beforeEach(inject(function ($controller) {
    BumpCtrl = $controller('BumpCtrl', {});
  }));

  it('should ...', function () {
    expect(1).toBe(1);
  });

});
