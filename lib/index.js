import integration from 'analytics.js-integration';

export default function init( analytics ) {
  analytics.addIntegration( XNG );
}

init.Integration = XNG;


var XNG = integration( 'CrossEngage' )
  .readyOnLoad()
  .global( 'xng' )
  .option( 'apiKey', '' )
  // .option( 'serviceWorker', '' )
  // .option( 'safariWebsitePushID', '' )
  .tag( '<script src="https://test.crossengage.io/xng.min.js">' );

let mocked;


XNG.prototype.initialize = () => {
  mockXNG( window );

  window.xng.init( this.options.apiKey );

  this.load( this.ready );
}

XNG.prototype.loaded = () => ( window.xng instanceof Object );

XNG.prototype.page = ( page ) => {
  this.debug( 'xng:page', page );

  window.xng.send( 'track', page.json() );
};

XNG.prototype.identify = ( identify ) => {
  this.debug( 'xng:identify', identify );

  window.xng.send( 'identify', identify.json() );
  // window.xng.send( 'identify', identify.json(), () => window.xng.safariPush( this.options.safariWebsitePushID ) );
};

XNG.prototype.group = ( group ) => {
  this.debug( 'xng:group', group );

  window.xng.send( 'group', group.json() );
};

XNG.prototype.track = ( track ) => {
  this.debug( 'xng:track', track );

  window.xng.send( 'track', track.json() );
};

XNG.prototype.alias = ( alias ) => {
  var user = this.analytics.user();
  var json = alias.json();

  json.previousId = json.previousId || json.from || user.id() || user.anonymousId();
  json.userId = json.userId || json.to;

  delete json.from;
  delete json.to;

  this.debug( 'xng:alias', alias, json );
  window.xng.send( 'alias', json );
};


function mockXNG( w, xng ) {
  xng = w.xng = w.xng || [];

  if ( !xng.init ) {
    if ( !mocked ) {
      mocked = true;

      var methods = [
        'init',
        'send',
        'push',
        'safariPush'
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
