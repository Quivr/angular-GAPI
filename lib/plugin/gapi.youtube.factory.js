;(function () {
  'use strict';
  angular.module('angularGAPI')
    .factory('Youtube', ['GAPI', youtubeFact]);

  function youtubeFact(GAPI) {
    var Youtube = new GAPI('youtube', 'v3', {
      activities: ['list', 'insert'],
      captions: ['list', 'insert', 'update', 'delete'],
      channelSections: ['list', 'insert', 'update', 'delete'],
      channels: ['list', 'update'],
      commentThreads: ['list', 'insert', 'update'],
      comments: ['list', 'insert', 'delete', 'update'],
      guideCategories: ['list'],
      i18nLanguages: ['list'],
      i18nRegions: ['list'],
      playlistItems: ['list', 'insert', 'update', 'delete'],
      playlists: ['list', 'insert', 'update', 'delete'],
      subscriptions: ['list', 'insert', 'delete'],
      thumbnails: ['set'],
      videoAbuseReportReasons: ['list'],
      videoCategories: ['list'],
      videos: ['list', 'insert', 'update', 'delete'],
      watermarks: ['set', 'unset']
    });

    // Some methods don't fit the pattern
    // Define them explicitly here
    Youtube.insertChannelBanners = function (params) {
      return Youtube.post('channelBanners', 'insert', undefined, params);
    };

    Youtube.markCommentsAsSpam = function (params) {
      return Youtube.post('comments', 'markAsSpam', undefined, params);
    };

    Youtube.setCommentsModerationStatus = function (params) {
      return Youtube.post('comments', 'setModerationStatus', undefined, params);
    };

    Youtube.rateVideos = function (params) {
      return Youtube.post('videos', 'rate', undefined, params);
    };

    Youtube.getVideoRating = function (params) {
      return Youtube.get('videos', 'getRating', params);
    };

    Youtube.reportVideoAbuse = function (params) {
      return Youtube.post('videos', 'reportAbuse', undefined, params);
    };

    Youtube.search = function (params) {
      return Youtube.get('search', params);
    };

    return Youtube;
  }
})();
