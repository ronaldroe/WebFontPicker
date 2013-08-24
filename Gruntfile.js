module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        filename: 'WFP',

        dependencies: [
            'vendor/jquery-2.0.3.js',
            'vendor/underscore.js',
            'vendor/backbone.js'
        ],

        jsfiles: [
            'src/Helpers.js',
            'src/Templates.js',
            'src/Interfaces/*.js',
            'src/Models/*.js',
            'src/Collections/*.js',
            'src/Views/*.js',
            'src/Views/**/*.js',
            'src/Initialize.js'
        ],

        sassfiles: ['sass/main.scss'],

        jst: {
            compile: {
                options: {
                    namespace: 'WFP.Templates',
                    templateSettings: {
                        variable: 'obj'
                    },
                    processName: function(filename) {
                        filename = filename.split('/');
                        return filename[filename.length - 1].split('.')[0];
                    },
                    prettify: true
                },
                files: {
                    'src/Templates.js': ['src/templates/*.tmpl']
                }
            }
        },

        concat: {
            dist: {
                options: {
                    banner: [
                        '/*!',
                        ' * Web Font Picker <%= pkg.version %>',
                        ' * Last updated: <%= grunt.template.today("yyyy-mm-dd") %>',
                        ' * ',
                        ' * (c) 2013 Daniel Gavrilov',
                        ' * MIT License',
                        ' */',
                        ' ',
                        '(function(window, document, $, Backbone, undefined) {',
                        ' ',
                        'var WFP = window.WFP = window.WFP || {};',
                        'WFP.VERSION = "<%= pkg.version %>";',
                        '\n'
                    ].join('\n'),
                    footer: '\n})(window, document, jQuery, Backbone);'
                },
                src: ['<%= jsfiles %>'],
                dest: 'build/<%= filename %>.dev.js'
            }
        },

        uglify: {
            options: {
                preserveComments: 'some',
                mangle: true,
                compress: true
            },
            dist: {
                files: {
                    'build/<%= filename %>.min.js': ['<%= dependencies %>', '<%= concat.dist.dest %>'],
                }
            }
        },

        /* Fix: sass compiles to an empty file */
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'build/<%= filename %>.css': ['<%= sassfiles %>']
                }
            }
        },

        watch: {
            all: {
                files: ['Gruntfile.js', '<%= jsfiles %>'],
                tasks: ['concat']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jst','concat']); 
    grunt.registerTask('release', ['jst','concat','uglify']);
};