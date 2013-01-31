'use strict';

var dropboxChooser = angular.module('dropboxChooser', []).constant('DROPBOX_CONFIG', { BASE_URL: "https://www.dropbox.com", API_KEY: 'bu9otnx7trxsblk' })

dropboxChooser.run( function($rootScope, DROPBOX_CONFIG) {

  $rootScope.Dropbox = {};

  // Inject CSS
  var css = document.createElement("style");
  css.type = "text/css";
  var cssText =
    ".dropbox-chooser { width: 152px; height: 25px; cursor: pointer;" +
                     " background: url('"+ DROPBOX_CONFIG.BASE_URL +"/static/images/widgets/chooser-button-sprites.png') 0 0}" +
    ".dropbox-chooser:hover { background-position: 0 -25px}" +
    ".dropbox-chooser:active { background-position: 0 -50px}" +
    ".dropbox-chooser-used { background-position: 152px 0 }" +
    ".dropbox-chooser-used:hover { background-position: 152px -25px}" +
    ".dropbox-chooser-used:active { background-position: 152px -50px}";
  if (css.styleSheet) {  // IE
    css.styleSheet.cssText = cssText;
  } else {
    css.textContent = cssText;
  }
  document.getElementsByTagName("head")[0].appendChild(css);

  // Inject ieFrame on DOM load
  jQuery(function(){
    var ieframe = document.createElement("iframe");
    ieframe.setAttribute("id", "dropbox_xcomm");
    ieframe.setAttribute("src", DROPBOX_CONFIG.BASE_URL + "/fp/xcomm");
    ieframe.style.display = 'none';
    document.getElementsByTagName("body")[0].appendChild(ieframe);
    $rootScope.Dropbox._ieframe = ieframe;
  });


})

dropboxChooser.directive('dropboxchooser', function () {
	return {
    priority: 1,
    restrict:'E',
    transclude:true,
    scope: {},
    template:'<div class="dropbox-chooser"><input type="dropbox-chooser" name="selected-file" style="visibility: hidden;" ng-show="false" /></div>',
    controller: 'DropboxChooserCtrl',
    link: function postLink($scope, $element, $attrs) {
      var el = $element.find('input')[0];
      var btn = $element[0];

      $element.click(function(){
        $scope.choose({
          success: function(files) {
            el.value = files[0].url;
            el.files = files;

            if( document.createEvent ) {
              var evObj = document.createEvent('Event');
              evObj.initEvent( 'DbxChooserSuccess', true, false );
              evObj.files = files;
              el.dispatchEvent( evObj );
            }
            btn.className = "dropbox-chooser dropbox-chooser-used";
          },
          cancel: function() {
            if( document.createEvent ) {
              var event = document.createEvent("Event");
              event.initEvent("DbxChooserCancel", true, true);
              el.dispatchEvent(event);
            }
          },
          linkType: el.getAttribute('data-link-type') ? el.getAttribute('data-link-type') : 'preview',
          _trigger: 'button'  //log that this came from a button

        })
      });
    },
    replace:true
  };
});

dropboxChooser.controller('DropboxChooserCtrl', function($scope, $rootScope, DROPBOX_CONFIG) {

  var Dropbox = {
    appKey: DROPBOX_CONFIG.API_KEY
  };

  Dropbox.addListener = function(obj, event, handler) {
    if (obj.addEventListener) {
      obj.addEventListener(event, handler, false);
    } else {
      obj.attachEvent("on" + event, handler);
    }
  };

  Dropbox.removeListener = function(obj, event, handler) {
    if (obj.removeEventListener) {
      obj.removeEventListener(event, handler, false);
    } else {
      obj.detachEvent("on" + event, handler);
    }
  };

  Dropbox._chooserUrl = function(options) {
    var linkType = options.linkType == 'direct' ? 'direct' : 'preview'
    var triggerSrc = options._trigger || 'js';  //used for logging.  default is 'js'
    return DROPBOX_CONFIG.BASE_URL + "/chooser?origin=" + encodeURIComponent(window.location.protocol + "//" + window.location.host)
      + "&app_key=" + encodeURIComponent(this.appKey)
      + "&link_type=" + linkType
      + "&trigger=" + triggerSrc;
  };

  Dropbox._createWidgetElement = function(options) {
    var widget = document.createElement("iframe");
    widget.src = Dropbox._chooserUrl(options);
    widget.style.display = "block";
    widget.style.width = "660px";
    widget.style.height = "440px";
    widget.style.backgroundColor = "white";
    widget.style.border = "none";
    return widget;
  };

  Dropbox._handleMessageEvent = function(evt, closefn, success, cancel) {
    var data = JSON.parse(evt.data);
    if (data.method == "files_selected") {
      if (closefn) closefn();
      if (success) success([data.params]);
    } else if (data.method == "close_dialog") {
      if (closefn) closefn();
      if (cancel) cancel();
    }
  };

  Dropbox.createWidget = function(options) {
    var widget = Dropbox._createWidgetElement(options);
    widget._handler = function(evt) {
      if (evt.source == widget.contentWindow) {
        Dropbox._handleMessageEvent(evt, null, options.success, options.cancel);
      }
    };
    Dropbox.addListener(window, "message", widget._handler);
    return widget;
  }

  Dropbox.cleanupWidget = function(widget) {
    if (!widget._handler) throw "Invalid widget!";
    Dropbox.removeListener(window, "message", widget._handler);
    delete widget._handler;
  }

  Dropbox.choose = function(options) {
    if (typeof options == "undefined") {
      throw "You must pass in options";
    }
    if (options.iframe) {
      var widget = Dropbox._createWidgetElement(options);
      var outer = document.createElement("div");
      outer.style.position = "fixed";
      outer.style.left = outer.style.right = outer.style.top = outer.style.bottom = "0px";
      outer.style.zIndex = "1000";
      var bg = document.createElement("div");
      bg.style.position = "absolute";
      bg.style.left = bg.style.right = bg.style.top = bg.style.bottom = "0px";
      bg.style.backgroundColor = "rgb(160, 160, 160)";
      bg.style.opacity = "0.2";
      bg.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";  // IE8.
      var inner = document.createElement("div");
      inner.style.position = "relative";
      inner.style.width = "660px";
      inner.style.margin = "125px auto 0px auto";
      inner.style.border = "1px solid #ACACAC";
      inner.style.boxShadow = "rgba(0, 0, 0, .2) 0px 4px 16px";
      inner.appendChild(widget);
      outer.appendChild(bg);
      outer.appendChild(inner);
      document.body.appendChild(outer);

      var handler = function(evt) {
        if (evt.source == widget.contentWindow) {
          Dropbox._handleMessageEvent(evt, function() {
            document.body.removeChild(outer);
            Dropbox.removeListener(window, "message", handler);
          }, options.success, options.cancel);
        }
      };
      Dropbox.addListener(window, "message", handler);
    } else {
      var w = 660;
      var h = 440;
      var left = (window.screenX || window.screenLeft) + ((window.outerWidth || document.documentElement.offsetWidth) - w) / 2;
      var top = (window.screenY || window.screenTop) + ((window.outerHeight || document.documentElement.offsetHeight) - h) / 2;
      var popup = window.open(Dropbox._chooserUrl(options), "dropbox", "width=" + w + ",height=" + h + ",left=" + left + ",top=" + top + ",resizable=yes,location=yes");
      popup.focus();
      var handler = function(evt) {
        if (evt.source == popup || evt.source == $rootScope.Dropbox._ieframe.contentWindow) {
          Dropbox._handleMessageEvent(evt, function() {
            popup.close();
            Dropbox.removeListener(window, "message", handler);
          }, options.success, options.cancel);
        }
      };
      Dropbox.addListener(window, "message", handler);
    }
  };

  $scope.choose = Dropbox.choose;

});