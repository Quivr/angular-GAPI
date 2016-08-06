;(function () {
  'use strict';
  angular.module('angularGAPI')
    .factory('Drive', ['GAPI', driveFact]);

  function driveFact(GAPI) {
    var Drive = new GAPI('drive', 'v2', {
      files: ['get', 'list', 'insert', 'update', 'delete', 'patch', {
        children: ['get', 'list', 'insert', 'delete'],
        parents: ['get', 'list', 'insert', 'delete'],
        permissions: ['get', 'list', 'insert', 'update', 'delete', 'patch'],
        revisions: ['get', 'list', 'update', 'delete', 'patch'],
        comments: ['get', 'list', 'insert', 'update', 'delete', 'patch', {
          replies: ['get', 'list', 'insert', 'update', 'delete', 'patch']
        }],
        properties: ['get', 'list', 'insert', 'update', 'delete', 'patch'],
        realtime: ['get']
      }],
      changes: ['get', 'list'],
      apps: ['get', 'list']
    });

    Drive.copyFile = function (fileId, data, params) {
      return Drive.post('files', fileId, 'copy', data, params);
    };

    Drive.touchFile = function (fileId) {
      return Drive.post('files', fileId, 'touch');
    };

    Drive.trashFile = function (fileId) {
      return Drive.post('files', fileId, 'trash');
    };

    Drive.untrashFile = function (fileId) {
      return Drive.post('files', fileId, 'untrash');
    };

    Drive.watchFile = function (fileId, data) {
      return Drive.post('files', fileId, 'watch', data);
    };

    Drive.emptyTrash = function () {
      return GAPI.request({
        method: 'DELETE',
        url: Drive.url + 'files/trash'
      })
    };

    Drive.generateIds = function (params) {
      return Drive.get('files', 'generateIds', params);
    };

    Drive.about = function (params) {
      return Drive.get('about', params);
    };

    Drive.watchChanges = function (data) {
      return Drive.post('changes', 'watch', data);
    };

    Drive.getPermissionIdForEmail = function (email) {
      return Drive.get('permissionIds', email);
    };

    Drive.stopChannels = function (data) {
      return Drive.post('channels', 'stop', data);
    };

    Drive.updateRealtime = function (fileId, params) {
      return GAPI.request({
        method: 'PUT',
        url: Drive.url + ['files', fileId, 'realtime'].join('/'),
        params: params
      });
    };

    return Drive;
  }
})();
