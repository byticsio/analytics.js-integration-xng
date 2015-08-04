import integration from 'analytics.js-integration';
// import assign from 'object-assign';
// import ads from 'ad-params';
// import utm from 'utm-params';
// import { Jar } from 'cookie-jar';

// import globalQ from 'global-queue';
//
// const push = globalQ('_xng');


export default function init( analytics ) {
  analytics.addIntegration( XNG );
}

init.Integration = XNG;


var XNG = integration( 'CrossEngage' )
  .global( 'xng' )
  .option( 'apiKey', '' )
  .assumesPageview()
  // .readyOnInitialize()
  .tag( '<script src="https://crossengage.io/xng.min.js">' );

// const jarConfig = {
//   maxAge : 31536000000, // 1y
//   secure : false,
//   path   : '/'
// };


XNG.prototype.initialize = ( page ) => {
  window.xng.init( this.options.apiKey );

  this.load( this.ready );

  if ( page ) {
    this.page( page );
  }
}

XNG.prototype.loaded = () => ( window.xng instanceof Object );

XNG.prototype.page = ( page ) => {
  this.debug( 'xng:page', page );

  window.xng.send( 'track', page.json() );
};

XNG.prototype.identify = ( identify ) => {
  this.debug( 'xng:identify', identify );

  window.xng.send( 'identify', identify.json(), () => window.xng.safariPush() );
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

// XNG.prototype.normalize = ( msg ) => {
//   this.debug( 'normalize %o', msg );
//
//   const user  = this.analytics.user();
//   const query = location.search;
//   const ctx   = msg.context = msg.context || msg.options || {};
//
//   delete msg.options;
//
//   msg.writeKey = this.options.apiKey;
//   ctx.userAgent = navigator.userAgent;
//
//   if ( !ctx.library ) {
//     ctx.library = {
//       name    : 'analytics.js',
//       version : this.analytics.VERSION
//     };
//   }
//
//   if ( query ) {
//     ctx.campaign = utm( query );
//   }
//
//   this.referrerId( query, ctx );
//
//   assign( msg, {
//     userId      : msg.userId || user.id(),
//     anonymousId : user.anonymousId(),
//     messageId   : uuid(),
//     sentAt      : new Date()
//   });
//
//   this.debug( 'normalized %o', msg );
//
//   return msg;
// };
//
// XNG.prototype.cookie = function ( name, val ) {
//   if ( arguments.length === 1 ) {
//     return jar.get( name );
//   }
//
//   var href = window.location.href;
//   var domain = '.' + top( href );
//
//   if ( '.' === domain ) {
//     domain = '';
//   }
//
//   var config = assign( { domain }, jarConfig );
//
//   this.debug( 'store domain %s -> %s', href, domain );
//   this.debug( 'store %s, %s, %o', name, val, config );
//
//   jar.set( name, val, config );
//
//   if ( jar.get( name ) ) {
//     return;
//   }
//
//   delete config.domain;
//
//   this.debug( 'fallback store %s, %s, %o', name, val, config );
//
//   jar.set( name, val, config );
// };
//
// XNG.prototype.referrerId = function ( query, ctx ) {
//   let stored = this.cookie( 'xng:context.referrer' );
//   let ad;
//
//   if ( stored ) {
//     stored = JSON.parse(stored);
//   }
//
//   ad = query ?
//     ads( query ) :
//     stored;
//
//   if ( !ad ) {
//     return;
//   }
//
//   ctx.referrer = assign( ctx.referrer || {}, ad );
//
//   this.cookie( 'xng:context.referrer', JSON.stringify( ad ) );
// };
//
// XNG.prototype.send = ( uri, msg, fn ) => {
//   this.debug( 'xng:send.init %s %o', uri, msg );
//
//   window.xng.send( uri, this.normalize( msg ), fn );
// };
