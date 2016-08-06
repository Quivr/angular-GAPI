;(function () {
  'use strict';
  angular.module('angularGAPI')
    .factory('Plus', ['GAPI', plusFact]);

  function plusFact(GAPI) {
    var Plus = new GAPI('plus', 'v1', {
      people: ['get', {
        activities: ['list']
      }],
      activities: ['get', {
        comments: ['list']
      }],
      comments: ['get']
    });

    Plus.searchPeople = function (params) {
      return Plus.get('people', params);
    };

    Plus.listPeopleByActivity = function (activityId, collection, params) {
      return Plus.get('activities', activityId, 'people', collection, params);
    };

    Plus.listPeople = function (userId, collection, params) {
      return Plus.get('people', userId, 'people', collection, params);
    };

    Plus.searchActivities = function (params) {
      return Plus.get('activities', params);
    };

    Plus.insertMoments = function (userId, collection, data, params) {
      return Plus.post('people', userId, 'moments', collection, data, params);
    };

    Plus.listMoments = function (userId, collection, params) {
      return Plus.get('people', userId, 'moments', collection, params);
    };

    Plus.removeMoments = function (id) {
      return GAPI.request({
        method: 'DELETE',
        url: Plus.url + ['moments', id].join('/')
      });
    };

    return Plus;
  }
})();
