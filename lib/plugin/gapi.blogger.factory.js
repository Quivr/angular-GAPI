;(function () {
  'use strict';
  angular.module('angularGAPI')
    .factory('Blogger', ['GAPI', bloggerFact]);

  function bloggerFact(GAPI) {

    var Blogger = new GAPI('blogger', 'v3', {
      users: ['get'],
      blogs: ['get', {
        pages: ['list', 'get', 'insert', 'update', 'patch', 'delete'],
        posts: ['list', 'get', 'insert', 'update', 'patch', 'delete', {
          comments: ['list', 'get', 'delete']
        }]
      }]
    });

    Blogger.getBlogByUrl = function (params) {
      return Blogger.get('blogs', 'byurl', params);
    };

    Blogger.listBlogsByUser = function (userId, params) {
      return Blogger.get('users', userId, 'blogs', params);
    };

    Blogger.approveComments = function (blogId, postId, commentId) {
      return Blogger.post('blogs', blogId, 'posts', postId, 'comments', commentId, 'approve');
    };

    Blogger.listCommentsByBlog = function (blogId, params) {
      return Blogger.get('blogs', blogId, 'comments', params);
    };

    Blogger.markCommentsAsSpam = function (blogId, postId, commentId) {
      return Blogger.post('blogs', blogId, 'posts', postId, 'comments', commentId, 'spam');
    };

    Blogger.removeContent = function (blogId, postId, commentId) {
      return Blogger.post('blogs', blogId, 'posts', postId, 'comments', commentId, 'removecontent');
    };

    Blogger.searchPosts = function (blogId, params) {
      return Blogger.get('blogs', blogId, 'posts/search', params);
    };

    Blogger.getPostsByPath = function (blogId, params) {
      return Blogger.get('blogs', blogId, 'posts/bypath', params);
    };

    Blogger.publishPosts = function (blogId, postId, params) {
      return Blogger.post('blogs', blogId, 'posts', postId, 'publish', undefined, params);
    };

    Blogger.revertPosts = function (blogId, postId) {
      return Blogger.post('blogs', blogId, 'posts', postId, 'revert');
    };

    Blogger.getBlogUserInfos = function (userId, blogId, params) {
      return Blogger.get('users', userId, 'blogs', blogId, params);
    };

    Blogger.getPageViews = function (blogId, params) {
      return Blogger.get('blogs', blogId, 'pageviews', params);
    };

    Blogger.getPostUserInfos = function (userId, blogId, postId, params) {
      return Blogger.get('users', userId, 'blogs', blogId, 'posts', postId, params);
    };

    Blogger.listPostUserInfos = function (userId, blogId, params) {
      return Blogger.get('users', userId, 'blogs', blogId, 'posts', params);
    };

    return Blogger;
  }
})();
