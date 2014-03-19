/*
 * grunt-interfake
 * https://github.com/Horsed/grunt-interfake
 *
 * Copyright (c) 2014 Martin Knopf
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('interfake', 'Starting an interfake server with grunt.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      port: 3000
    });

    var Interfake = require('interfake');
    var interfake = new Interfake();

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      
      f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        interfake.loadFile(filepath);
      });
    });
    
    if(options.endpoints)
      for(var i = 0, len = options.endpoints.length; i < len; i++)
        interfake.createRoute(options.endpoints[i]);

    grunt.log.ok('Starting interfake server at port ' + options.port);

    interfake.listen(options.port);
    
    var done = this.async();
  });

};
