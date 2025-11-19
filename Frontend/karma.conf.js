 module.exports = function (config) {
   config.set({
     frameworks: ['jasmine', '@angular-devkit/build-angular'],
     plugins: [
       require('karma-jasmine'),
       require('karma-chrome-launcher'),
       require('karma-junit-reporter'),
       require('karma-coverage'),
       require('@angular-devkit/build-angular/plugins/karma')
     ],
     reporters: ['progress', 'junit', 'coverage'],
     junitReporter: {
       outputDir: 'test-results',
       outputFile: 'test-results.xml',
       useBrowserName: false
     },
     coverageReporter: {
       dir: require('path').join(__dirname, './coverage'),
       reporters: [
         { type: 'lcov' },
         { type: 'cobertura' },
         { type: 'text-summary' }
       ]
     },
     preprocessors: {
       // Añade los archivos que deseas instrumentar para la cobertura
       'src/**/*.ts': ['coverage'], // Asegúrate de instrumentar los archivos de tu aplicación
     },
     port: 9876,
     colors: true,
     logLevel: config.LOG_INFO,
     autoWatch: true,
     browsers: ['ChromeHeadless'],
     singleRun: true,
     restartOnFileChange: true
   });
 };
