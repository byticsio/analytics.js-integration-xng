'use strict';

var Analytics = require('@segment/analytics.js-core').constructor;
var integration = require('@segment/analytics.js-integration');
var sandbox = require('@segment/clear-env');
var tester = require('@segment/analytics.js-integration-tester');
var Xng = require('../lib/');

describe('CrossEngage', function() {
  var xng;
  var analytics;
  var options = {
    apiKey: 'azerty',
    siteID: 'ytreza',
    addFormID: '1',
    debug: false,
    additionalOptions: null
  };

  beforeEach(function() {
    analytics = new Analytics();
    xng = new Xng(options);
    analytics.use(Xng);
    analytics.use(tester);
    analytics.add(xng);
  });

  afterEach(function() {
    analytics.restore();
    analytics.reset();
    xng.reset();
    sandbox();
  });

  it('should have the right settings', function() {
    analytics.compare(Xng, integration('CrossEngage')
      .global('xng')
      .option('apiKey', '')
      .option('siteID', '')
      .option('adformID', '')
      .option('debug', false)
      .option('additionalOptions', null)
      .readyOnLoad());
  });
});
