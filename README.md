Angular-GAPI
============

Angular-GAPI is an AngularJS module for accessing different [Google APIs](https://code.google.com/apis/console/).

The code is based on [ngGAPI](https://github.com/christiansmith/ngGAPI)

## Load

To use the module, include the main Angular-GAPI javascript file in your web page, as well as the scripts for all the API's that will be used:

```html
<!DOCTYPE HTML>
<html>
<body ng-app="app">
  //.....
  <script src="bower_components/angular-GAPI/lib/angular-GAPI.js"></script> 
  <script src="bower_components/angular-GAPI/lib/plugin/gapi.calendar.factory.js"></script> 
  <script src="bower_components/angular-GAPI/lib/plugin/gapi.user.factory.js"></script>
</body>
</html>
```
ngGAPI requires Google API JavaScript client library

```html
<script src="https://apis.google.com/js/client.js"></script>
```

## Installation

#### Bower

```bash
$ bower install quivr/angular-GAPI --save
```
#### Npm

```bash
$ npm install quivr/angular-GAPI --save
```

_then [load](https://github.com/quivr/angular-GAPI#load) it in your html_

#### Add module dependency

```javascript
angular.module('myApp', [
  'angularGAPI'
]);
```

## Usage

After you register your app in the [Google APIs Console](https://code.google.com/apis/console), configure angular-GAPI with credentials and whatever scopes you need for your app.

```javascript
angular.module('myApp')
  .value('GoogleApp', {
    apiKey: 'YOUR_API_KEY',
    clientId: 'YOUR_CLIENT_ID',
    scopes: [
      // whatever scopes you need for your app, for example:
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/userinfo.profile'
      // ...
    ]
  })
  ```

To use a specific service, inject it into your controllers by name. All GAPI methods return a promise.

```javascript
angular.module('myApp')
  .controller('VideosCtrl', function ($scope, Youtube) {
    $scope.videos = Youtube.search({ part: 'snippet', q: 'Search terms' })
  });
```

## Services

#### GAPI authorization

* GAPI.init()
* GAPI.disconnect()

Note: If pop-ups are being blocked, make sure to have gapi loaded before calling GAPI.init().

```javascript
gapi.load('auth', function() { GAPI.init() });
```

For a full documentation of the available functions, consult the [wiki](https://github.com/Quivr/angular-GAPI/wiki)
