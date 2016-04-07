var jasmineReporters = require('jasmine-reporters'),
  config = require('../../config'),
  jasmineSpecReporter = require('jasmine-spec-reporter');


module.exports.getReporters = function () {
  var specReporter = new jasmineSpecReporter({
    displaySuccessfulSpec: false,
    displayFailuresSummary: false,
    displayStacktrace: 'specs'
  });
  var reporters = [specReporter];
  if (config.env.teamcity) {
    var teamcityReporter = new jasmineReporters.TeamCityReporter();
    reporters.push(teamcityReporter);
  }
  return reporters;
};