;(function () {
  'use strict';
  angular.module('angularGAPI', [])
    .factory('GAPI', ['$q', '$http', '$log', '$window', 'GoogleApp', GAPIFact]);

  function GAPIFact($q, $http, $log, $window, GoogleApp) {
    /**
     * GAPI Credentials
     */
    GAPI.app = GoogleApp;

    /**
     * Google APIs base URL
     */
    var server = 'https://www.googleapis.com';

    /**
     * Generate a method name from an action and a resource
     */
    function methodName(action, resource) {
      // allow resources with a path prefix
      resource = resource.split('/').pop();
      // uppercase the first character
      resource = resource.charAt(0).toUpperCase() + resource.slice(1);
      return action + resource;
    }

    /**
     * Recurse through a "spec" object and create methods for
     * resources and nested resources.
     *
     * For each resource in the provided spec, we define methods
     * for each of the its actions.
     */
    function createMethods(service, spec, parents) {
      var resources = Object.keys(spec);

      resources.forEach(function (resource) {
        var actions = spec[resource];
        actions.forEach(function (action) {
          // if the action is an object, treat it as a nested
          // spec and recurse
          if (typeof action === 'object') {
            if (!parents) {
              parents = [];
            }
            // we can't keep passing around the
            // same array, we need a new one
            var p = parents.concat([resource]);
            createMethods(service, action, p);
          } else {
            var method = methodName(action, resource);
            service[method] = GAPI[action](resource, parents);
          }
        });
      });
    }

    /**
     * GAPI Service Constructor
     */
    function GAPI(api, version, spec) {
      this.api = api;
      this.version = version;
      this.url = [server, api, version, ''].join('/');

      createMethods(this, spec);
    }

    /**
     * OAuth 2.0 Signatures
     */
    function oauthHeader(options) {
      if (!options.headers) {
        options.headers = {};
      }
      options.headers['Authorization'] = 'Bearer ' + GAPI.app.oauthToken.access_token;
    }

    function oauthParams(options) {
      if (!options.params) {
        options.params = {};
      }
      options.params.access_token = GAPI.app.oauthToken.access_token;
    }

    /**
     * HTTP Request Helper
     */
    function request(config) {
      var deferred = $q.defer();

      oauthHeader(config);

      function success(response) {
        $log.log('Request success: ', config, response);
        if (response.data)
          deferred.resolve(response.data);
        else
          deferred.resolve(response);
      }

      function failure(fault) {
        $log.log('Request failure: ', config, fault);
        deferred.reject(fault);
      }

      $http(config).then(success, failure);
      return deferred.promise;
    }

    GAPI.request = request;

    /**
     * HTTP GET method available on service instance
     */
    GAPI.prototype.get = function () {
      var args = Array.prototype.slice.call(arguments)
        , path = []
        , params
        ;

      args.forEach(function (arg, i) {
        if (arg && typeof arg !== 'object') {
          path.push(arg);
        } else {
          params = arg
        }
      });

      return request({
        method: 'GET',
        url: this.url + path.join('/'),
        params: params
      });
    };

    /**
     * HTTP POST method available on service instance
     */
    GAPI.prototype.post = function () {
      var args = Array.prototype.slice.call(arguments)
        , path = []
        , other = 0
        , data
        , params
        ;

      args.forEach(function (arg, i) {
        if (!arg || typeof arg === 'object') { // if the arg is not part of the path
          other += 1;                          // increment the number of nonpath args
          if (other === 1) {
            data = arg;
          }
          if (other === 2) {
            params = arg;
          }
        } else {                               // if the arg is defined and not and object
          path.push(arg);                      // push to the path array
        }
      });

      return request({
        method: 'POST',
        url: this.url + path.join('/'),
        data: data,
        params: params
      });
    };

    /**
     * Build a resource url, optionally with nested resources
     */
    function resourceUrl(args, parents, base, resource) {
      var argIndex = 0
        , nodes = []
        , params = args[args.length.toString()]
        ;

      if (parents && parents.length > 0) {
        parents.forEach(function (parent, i) {
          nodes.push(parent, encodeURIComponent(args[i.toString()]));
          argIndex += 1;
        });
      }

      nodes.push(resource);
      if (['string', 'number'].indexOf(typeof args[argIndex.toString()]) !== -1) {
        nodes.push(args[argIndex.toString()]);
      }

      return base += nodes.join('/');
    }

    /**
     * Parse params from arguments
     */
    function parseParams(args) {
      var last = args[(args.length - 1).toString()];
      return (typeof last === 'object') ? last : null
    }

    /**
     * Parse data and params from arguments
     */
    function parseDataParams(a) {
      var args = Array.prototype.slice.call(a)
        , parsedArgs = {}
        , other = 0
        ;

      args.forEach(function (arg, i) {
        if (!arg || typeof arg === 'object') {
          other += 1;
          if (other === 1) {
            parsedArgs.data = arg;
          }
          if (other === 2) {
            parsedArgs.params = arg;
          }
        }
      });

      return parsedArgs;
    }

    /**
     * Resource methods
     *
     * These methods are used to construct a service.
     * They are not intended to be called directly on GAPI.
     */
    GAPI.get = function (resource, parents) {
      return function () {
        return request({
          method: 'GET',
          url: resourceUrl(arguments, parents, this.url, resource),
          params: parseParams(arguments)
        });
      };
    };

    GAPI.set = function (resource, parents) {
      return function () {
        return request({
          method: 'POST',
          url: resourceUrl(arguments, parents, this.url, resource) + '/set',
          params: parseParams(arguments)
        });
      };
    };

    GAPI.unset = function (resource, parents) {
      return function () {
        return request({
          method: 'POST',
          url: resourceUrl(arguments, parents, this.url, resource) + '/unset',
          params: parseParams(arguments)
        });
      };
    };

    GAPI.list = function (resource, parents) {
      return function () {
        return request({
          method: 'GET',
          url: resourceUrl(arguments, parents, this.url, resource),
          params: parseParams(arguments)
        });
      };
    };

    GAPI.insert = function (resource, parents) {
      return function () {
        var args = parseDataParams(arguments);
        return request({
          method: 'POST',
          url: resourceUrl(arguments, parents, this.url, resource),
          data: args.data,
          params: args.params
        });
      };
    };

    GAPI.update = function (resource, parents) {
      return function () {
        var args = parseDataParams(arguments);
        return request({
          method: 'PUT',
          url: resourceUrl(arguments, parents, this.url, resource),
          data: args.data,
          params: args.params
        });
      };
    };

    GAPI.patch = function (resource, parents) {
      return function () {
        var args = parseDataParams(arguments);
        return request({
          method: 'PATCH',
          url: resourceUrl(arguments, parents, this.url, resource),
          data: args.data,
          params: args.params
        });
      };
    };

    GAPI.delete = function (resource, parents) {
      return function () {
        return request({
          method: 'DELETE',
          url: resourceUrl(arguments, parents, this.url, resource),
          params: parseParams(arguments)
        });
      };
    };

    /**
     * Authorization
     * @param {Boolean} background specifies whether a gui should be shown to the user, otherwise everything is done in the background
     */
    GAPI.init = function (background) {
      var immediate = background || false;
      var deferred = $q.defer();

      // Make sure the google api is loaded
      if (typeof gapi !== 'undefined') {
        gapi.load('auth', function () {
          var app = GAPI.app,
            attemptCounter = 0,
            onAuth = function (response) {
              attemptCounter++;
              if (attemptCounter > 3) {
                deferred.reject('Login attempt failed. Attempted to login ' + attemptCounter + ' times.');
                return;
              }
              // The response could tell us the user is not logged in.
              if (response && !response.error) {
                if (response.status && response.status.signed_in === true) {
                  app.oauthToken = gapi.auth.getToken();
                  deferred.resolve(app);
                } else {
                  deferred.reject("App failed to log-in to Google API services.");
                }
              } else if (response && response.error_subtype === "access_denied") {
                deferred.reject("access_denied");
              } else {
                deferred.notify('Login attempt failed. Trying again. Attempt #' + attemptCounter);
                gapi.auth.authorize({
                    client_id: app.clientId,
                    scope: app.scopes,
                    immediate: immediate
                  }, onAuth
                );
              }
            };

          deferred.notify('Trying to log-in to Google API services.');

          gapi.auth.authorize({
              client_id: app.clientId,
              scope: app.scopes,
              immediate: immediate
            }, onAuth
          );
        });
      } else {
        console.log('Gapi not defined');
        deferred.reject();
      }

      return deferred.promise;
    };

    GAPI.visibilityChangeListener = false;

    /**
     * Upon calling this a new tab will be opened where the user can logout.
     */
    GAPI.disconnect = function () {

      var deferred = $q.defer();
      var manual = false;
      var attempts = 0;

      $http.jsonp('https://accounts.google.com/o/oauth2/revoke?token=' + GAPI.app.oauthToken.access_token).finally(function() {
        checkAuthorization();
      });

      function checkAuthorization() {
        attempts++;
        GAPI.init(true).then(
          function (response) {
            if (attempts < 3) {
              setTimeout(checkAuthorization(), 200);
            } else {
              if (manual) {
                removeListener();
                deferred.reject();
              } else {
                manualLogout();
              }
            }
          }
        ).catch(
          function (error) {
            if (error === 'access_denied') {
              removeListener();
              deferred.resolve();
            } else {
              if (attempts < 3) {
                setTimeout(checkAuthorization(), 200);
              } else {
                if (manual) {
                  removeListener();
                  deferred.reject();
                } else {
                  manualLogout();
                }
              }
            }
          }
        );
      }

      function manualLogout() {
        manual = true;
        $window.open('https://security.google.com/settings/security/permissions', '_blank');

        if (!GAPI.visibilityChangeListener) {
          document.addEventListener('visibilitychange', handleVisibilityChange);
          GAPI.visibilityChangeListener = true;
          attempts = 0;
        }
      }

      function handleVisibilityChange() {
        if (!document.hidden) {
          checkAuthorization();
        }
      }

      function removeListener() {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        GAPI.visibilityChangeListener = false;
      }

      return deferred.promise;
    };

    return GAPI;
  }
})();
