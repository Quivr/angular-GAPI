;(function () {
  'use strict';
  angular.module('angularGAPI')
    .factory('Calendar', ['GAPI', calendarFact]);

  function calendarFact(GAPI) {
    var Calendar = new GAPI('calendar', 'v3', {
      colors: ['get'],
      calendars: ['get', 'insert', 'update', 'delete', 'patch', {
        acl: ['list', 'get', 'insert', 'update', 'delete', 'patch'],
        events: ['list', 'get', 'insert', 'update', 'delete', 'patch']
      }],
      'users/me/calendarList': ['list', 'get', 'insert', 'update', 'delete', 'patch'],
      'users/me/settings': ['list', 'get']
    });

    Calendar.watchAcl = function (calendarId, params) {
      return Calendar.post('calendars', calendarId, 'acl', 'watch', undefined, params);
    };

    Calendar.watchCalendarList = function (params) {
      return Calendar.post('users', 'me', 'calendarList', 'watch', undefined, params);
    };

    Calendar.clearCalendar = function (id, params) {
      return Calendar.post('calendars', id, 'clear', undefined, params);
    };

    Calendar.importEvents = function (calendarId, data, params) {
      return Calendar.post('calendars', calendarId, 'events', 'import', data, params);
    };

    Calendar.moveEvents = function (calendarId, eventId, destinationId) {
      return Calendar.post('calendars', calendarId, 'events', eventId, 'move', undefined, {
        destination: destinationId
      });
    };

    Calendar.listEventInstances = function (calendarId, eventId, params) {
      return Calendar.get('calendars', calendarId, 'events', eventId, 'instances', params);
    };

    Calendar.quickAdd = function (id, params) {
      return Calendar.post('calendars', id, 'events', 'quickAdd', undefined, params);
    };

    Calendar.watchEvents = function (id, data, params) {
      return Calendar.post('calendars', id, 'events', 'watch', data, params);
    };

    Calendar.freeBusy = function (data) {
      return Calendar.post('freeBusy', data);
    };

    Calendar.stopWatching = function (data) {
      return Calendar.post('channels', 'stop', data)
    };

    return Calendar;
  }
})();
