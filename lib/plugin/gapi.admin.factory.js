;(function () {
  'use strict';
  angular.module('angularGAPI')
    .factory('Admin', ['GAPI', adminFact]);

  function adminFact(GAPI) {
    var Directory = new GAPI('admin/directory', 'v1', {
      users: ['get', 'insert', 'update', 'delete'],
      groups: ['get', 'insert', 'update', 'delete', 'list', 'patch', {
        members: ['get', 'insert', 'update', 'delete', 'patch', 'list']
      }]
    });

    Directory.makeAdmin = function (id) {
      var data = {'status': true};
      return Directory.post('users', id, 'makeAdmin', data);
    };

    Directory.unMakeAdmin = function (id) {
      var data = {'status': false};
      return Directory.post('users', id, 'makeAdmin', data);
    };

    Directory.listUsers = function (params) {
      return Directory.get('users', params);
    };

    return Directory;
  }
})();
