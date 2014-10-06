'use strict';

angular.module('iGitrasMason.version', [
  'iGitrasMason.version.interpolate-filter',
  'iGitrasMason.version.version-directive'
])

.value('version', '0.1');
