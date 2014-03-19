/*
 * grunt-interfake
 * https://github.com/Horsed/grunt-interfake
 *
 * Copyright (c) 2014 Martin Knopf
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    concurrent: {
      testWithInterfake: [
        'interfake:fixture1',
        'connect:server:keepalive'
      ]
    },

    // Configuration to be run (and then tested).
    interfake: {
      fixture1: {
        options: {
          port: 9000,
          endpoints: [{
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
          port: 9001,
        },
        src: ['tmp/endpoints.json'],
      },
    },

    // 
    connect: {
      server: {
        options: {
          port: 8088,
          hostname: 'localhost',
          middleware: function(connect, options, middlewares) {
            // inject a custom middleware into the array of default middlewares
            middlewares.push(function(req, res, next) {
              res.end('Hello, world from port #' + options.port + '!');
            });

            return middlewares;
          },
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-concurrent');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'interfake', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

  // By default, lint and run all tests.
  grunt.registerTask('ggg', ['concurrent:testWithInterfake']);
  grunt.registerTask('fff', ['connect:server:keepalive']);

};
