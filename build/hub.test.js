(function () {
  'use strict';

  /**
   * Trim string
   * @param str {String} String to be trimmed
   * @return {String} Trimmed string
   * @private
   */
  
  var trim = function (str) {
    return str.replace(trim.reg, '');
  };
  
  trim.reg = /^\s+|\s+$/g;
  var subscriptions = {};
  var rSplit = /\s+/;
  var clean = function () {
    //
  };
  
  /**
   * Hub
   * @public
   */
  
  var Hub = {};
  
  Hub['pub'] = function (channel) {
    var subscribers = subscriptions[channel] || [];
    var subscriber;
    var l = subscribers.length;
    var i = -1;
  
    while (++i < l) {
      subscriber = subscribers[i];
      subscriber.handler.apply(subscriber.context, arguments);
    }
  
    return this;
  };
  
  Hub['reset'] = function () {
    subscriptions = {};
    return this;
  };
  
  Hub['sub'] =  function (channels, handler, context) {
    channels = trim(channels).split(rSplit);
  
    var channel;
    var l = channels.length;
    var i = -1;
  
    while (++i < l) {
      channel = channels[i];
      subscriptions[channel] = subscriptions[channel] || [];
      subscriptions[channel].push({
        handler: handler,
        context: context
      });
    }
  
    return this;
  };
  
  Hub['unsub'] = function (channel, handler) {
    var subscribers = subscriptions[channel] || [];
    var subscriber;
    var l = subscribers.length;
    var i = -1;
    var retain = [];
  
    if (handler !== undefined) {
      while (++i < l) {
        subscriber = subscribers[i];
        if (subscriber.handler !== handler) {
          retain.push(subscriber);
        }
      }
      subscriptions[channel] = retain;
    } else {
      subscriptions[channel].length = 0;
    }
  
    return this;
  };
  
  /**
   * Export
   */
  
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = Hub;
  } else if (typeof define === 'function' && define.amd) {
    define('Hub', [], function () {
      return Hub;
    });
  } else if (typeof window === 'object') {
    window.Hub = Hub;
  }

}());