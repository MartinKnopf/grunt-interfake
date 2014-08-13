# grunt-interfake

> Starting an interfake server with grunt.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-interfake --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-interfake');
```

## The "interfake" task

### Overview
In your project's Gruntfile, add a section named `interfake` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  interfake: {
    fixture1: {
      options: {
        port: 9000,                         // default: 3000
        endpoints: [{                       // endpoints
          "request": {
            "url": "/whattimeisit",
            "method": "get"
          },
          "response": {
            "code": 200,
            "body": {
              "theTime": "Adventure Time!",
              "starring": [
                "Finn",
                "Jake"
              ],
              "location": "ooo"
            }
          }
        }]
      },
    },
    fixture2: {
      options: {
        port: 9000,                         // default: 3000
      },
      src: ['endpoints.json']               // has to be a JSON file
    },
  },
});
```

### Options

#### options.port
Type: `Integer`
Default value: `9000`

The port that the interfake server should be started at.

#### options.endpoints
Type: `Object`
Default value: see [example endpoints](https://github.com/basicallydan/interfake#example-more-examples-1)

### Usage example as fake backend server
In this example, interfake will be used as a backend server in a test setup. A proxy will forward all requests matching a regex pattern to the interfake server.

```js
var httpProxy = require('http-proxy');

var proxy = new httpProxy.RoutingProxy();

// forward requests to fake backend
var proxyFunction = function (req, res, next) {
  var match = req.url.match(/.*/users/xy12/.*/);
  if (match) {
    proxy.proxyRequest(req, res, {
      host: 'localhost',
      port: 9000
    });
  } else {
    next();
  }
};

grunt.initConfig({

  // fake backend
  interfake: {
    options: {
      port: 9000
    },
    src: ['endpoints.json'],
  },

  // web server for test environment
  connect: {
    options: {
      port: 8080,
      hostname: 'localhost'
    },
    test: {
      options: {
        middleware: function (connect) {
          return [
            proxyFunction,
            mountFolder(connect, 'static')
          ];
        }
      }
    }
  },

  // starts the interfake server and a web server
  concurrent: {
    testWithInterfake: [
      'interfake',
      'connect:test:keepalive'
    ]
  },
});

grunt.loadNpmTasks('grunt-interfake');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-concurrent');

grunt.registerTask('integrate', ['concurrent:testWithInterfake']);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
