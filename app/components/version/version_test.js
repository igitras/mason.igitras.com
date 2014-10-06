'use strict';

describe('iGitrasMason.version module', function() {
  beforeEach(module('iGitrasMason.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
