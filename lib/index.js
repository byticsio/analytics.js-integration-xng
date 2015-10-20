import integration from 'analytics.js-integration';

export default function init( analytics ) {
  analytics.addIntegration( XNG );
}

init.Integration = XNG;


var XNG = integration( 'CrossEngage' )
  .readyOnLoad()
  .global( 'xng' )
  .option( 'apiKey', '' )
  .option( 'siteID', '' )
  .option( 'adformID', '' )
  .tag( '<script src="https://test.crossengage.io/xng.min.js">' );

let mocked;


XNG.prototype.initialize = function () {
  mockXNG( window );

  window.xng.init( this.options.apiKey, this.options.siteID );

  window.xng.adform( this.options.adformID );

  this.load( this.ready );
};

XNG.prototype.loaded = function () {
  return ( window.xng && window.xng.version );
};

XNG.prototype.page = function ( page ) {
  this.debug( 'xng-integration:page', page );

  return window.xng.page( page.json() );
};

XNG.prototype.identify = function ( identify ) {
  this.debug( 'xng-integration:identify', identify );

  return window.xng.identify( identify.json() );
};

XNG.prototype.group = function ( group ) {
  this.debug( 'xng-integration:group', group );

  return window.xng.group( group.json() );
};

XNG.prototype.track = function ( track ) {
  this.debug( 'xng-integration:track', track );

  return window.xng.track( track.json() );
};

XNG.prototype.alias = function ( alias ) {
  var user = this.analytics.user();
  var json = alias.json();

  json.previousId = json.previousId || json.from || user.id() || user.anonymousId();
  json.userId = json.userId || json.to;

  delete json.from;
  delete json.to;

  this.debug( 'xng-integration:alias', alias, json );
  return window.xng.alias( json );
};


function mockXNG( w, xng ) {
  xng = w.xng = w.xng || [];

  if ( !xng.version ) {
    if ( !mocked ) {
      mocked = true;

      var methods = [
        'init',
        'track',
        'page',
        'identify',
        'group',
        'alias',
        'pushNotification',
        'safariPushNotification',
        'adform'
      ];

      var method;

      while ( method = methods.shift() ) {
        xng[ method ] = factory( method );
      }
    }
  }

  function factory( t ) {
    return function () {
      xng.push( Array.prototype.concat.apply( [ t ], arguments ) );
      return xng;
    };
  }
}
