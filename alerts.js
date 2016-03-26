var host = "http://XXX.XXX.XXX.XXX:18469/api/v1";
var username = 'XXXXXXXX';
var password = 'XXXXXXXX';

var allowedAlertTypes = {
   'chat': true,
   'follow': true,
   'rating received': true,
   'order confirmation': true,
   'payment received': true,
   'refund': true,
   'dispute_open': true,
   'dispute_close': true,
   'new order': true
};

var ZAPIER = !(typeof fetch == 'undefined');
var req = function(x) {
      return require(x); // Zapier agressively blocks require('literal')
   }
if (!ZAPIER) {
   var fetcher = req('node-fetch');
   var callback = function() {};
} else {
   var fetcher = fetch;
}

var model = {
   lastCallTime: 0,
   cookie: ' ',
   prevNotiTime: 0,
   prevMessTime: 0
};
var output = {
   messages: ''
};

var get_session = function(pModel) {
   model = (null == pModel.lastCallTime) ? model : pModel;
   // Is previous session less than 15 minutes old?
   var recent = Date.now() < pModel.lastCallTime + 900000;
   if (model.cookie && recent) {
      return new Promise(function(resolve, reject) {
         resolve(model.cookie);
      });
   }
   return fetcher(host + '/login' + '?username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password), {
         method: 'POST'
      })
      .then(function(res) {
         model.lastCallTime = Date.now();
         model.cookie = res.headers.get('set-cookie');
         return model.cookie;
      })
      .catch(callback);
};

var get_notifications = function(session_cookie) {
   var thisNotiTime = Math.round(Date.now() / 1000);
   return fetcher(host + '/get_notifications?limit=30', {
         headers: {
            cookie: session_cookie
         }
      })
      .then(function(res) {
         model.lastCallTime = Date.now();
         return res.json();
      })
      .then(function(json) {
         var message = '';
         if (json.unread) {
            for (var jn in json.notifications) {
               var n = json.notifications[jn];
               var fresh = n.timestamp > model.prevNotiTime;
               if (!n.read && fresh && allowedAlertTypes[n.type]) {
                  message += message ? '\n' : '';
                  message += (n.type.charAt(0).toUpperCase() + n.type.slice(1))
                           + (n.title ? (' of ' + n.title) : '')
                           + ' by ' + (n.handle ? n.handle : (n.guid.slice(0, 6) + '…'))
                           + ' (' + Math.round(((Date.now() / 1000) - n.timestamp) / 60) + ' min ago)';
               }
            }
         }
         output.messages += output.messages && message ? '\n\n' : '';
         output.messages += message;
         model.prevNotiTime = thisNotiTime;
         return session_cookie;
      })
      .catch(callback);
};

var get_chat_conversations = function(session_cookie) {
   var thisMessTime = Math.round(Date.now() / 1000);
   return fetcher(host + '/get_chat_conversations', {
         headers: {
            cookie: session_cookie
         }
      })
      .then(function(res) {
         model.lastCallTime = Date.now();
         return res.json();
      })
      .then(function(json) {
         var message = '';
         for (var j in json) {
            var c = json[j];
            var fresh = c.timestamp > model.prevMessTime;
            if (c.unread && fresh && allowedAlertTypes['chat']) {
               message += message ? '\n' : '';
               message += (c.handle ? c.handle : (c.guid.slice(0, 6) + '…')) + ':'
                        + ((c.unread > 1) ? (' [' + (c.unread - 1) + ' earlier unread] &') : '')
                        + ' “' + c.last_message + '”'
                        + ' (' + Math.round(((Date.now() / 1000) - c.timestamp) / 60) + ' min ago)';
            }
         }
         output.messages += output.messages && message ? '\n\n' : '';
         output.messages += message;
         model.prevMessTime = thisMessTime;
         return session_cookie;
      })
      .catch(callback);
};

String.prototype.hashCode = function() {
   var hash = 0,
      i, chr, len;
   if (this.length === 0) return hash;
   for (i = 0, len = this.length; i < len; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
   }
   return hash;
};

var secret = 'a' + host.hashCode() + password.hashCode();

if (!ZAPIER) {
   var store = {};
   store.getMany = function(data) {
      return new Promise(function(resolve, reject) {
         setTimeout(
            function() {
               // Promise which mocks up Zapier storage call
               resolve({
                  lastCallTime: null,
                  cookie: null,
                  prevNotiTime: null,
                  prevMessTime: null
               });
            }, 1);
      });
   };
   store.setMany = function(data) {
      return new Promise(function(resolve, reject) {
         setTimeout(
            function() {
               // Promise which mocks up Zapier storage call
               resolve(1);
            }, 1);
      });
   };
} else {
   var store = StoreClient(secret);
}
store.getMany(model)
   .then(get_session)
   .then(get_chat_conversations)
   .then(get_notifications)
   .then(function(cookie) {
      return store.setMany(model);
   })
   .then(function(value) {
      if (!output.messages) output = [];
      console.log(output.messages);
      if (ZAPIER) callback(null, output);
   })
   .catch(callback);
return output;
