;(function () {
  'use strict';
  angular.module('angularGAPI')
    .factory('User', ['GAPI', userFact]);

  function userFact(GAPI) {
    var User = new GAPI('plus', 'v1', {});

    User.getUserInfo = function(params) {
      return User.get('people', 'me', undefined, params);
    };

    return User;
  }
})();
