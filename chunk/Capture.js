
    (function() {
      /*
      * Capture all errors for this pen
      **/
      window.onerror = function(/* message, file, line */) {
        return true;
      };

      /**
      * Capture and kill Web Audio and Speech
      **/
      if (typeof (AudioContext) != "undefined") {
        AudioContext = function() {
          return false;
        };
      }
      if (typeof (webkitAudioContext) != "undefined") {
        webkitAudioContext = function() {
          return false;
        };
      }
      if (typeof (mozAudioContext) != "undefined") {
        mozAudioContext = function() {
          return false;
        };
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis = {};
      }
      if ("speak" in speechSynthesis) {
        speechSynthesis.speak = function() {
          return false;
        };
      }

      // Kill the browser asking for access to the video cam or audio
      navigator.webkitGetUserMedia = function() {
        // stop all calls in the grid.
      };

      /**
      * Capture and kill animations after X number of seconds
      **/
      var __animationDuration = 4000;
      var __animationsTimedOut = false;
      var __animationRequests = [];
      var __requestAnimationFrame = false;
      var __cancelAnimationFrame = false;
      var x, i;

      var vendorsReqestAnimationFrame = [
        "requestAnimationFrame",
        "mozRequestAnimationFrame",
        "webkitRequestAnimationFrame"
      ];

      // find the browsers requestAnimationFrame and cancelAnimationFrame
      for (x = 0; x < vendorsReqestAnimationFrame.length; x++) {
        if (!__requestAnimationFrame) {
          __requestAnimationFrame = window[vendorsReqestAnimationFrame[x]
          ];
        }
      }

      __cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

      // Wrap the requestAnimationFrame so we can stop it in the future
      function __reqFrame(callback, element) {
        // after the timeout we no longer take requests
        var timerID;
        if (__animationsTimedOut) {
          return 0;
        } else {
          timerID = __requestAnimationFrame(callback, element);
          __animationRequests.push(timerID);

          return timerID;
        }
      }

      for (x = 0; x < vendorsReqestAnimationFrame.length; x++) {
        window[vendorsReqestAnimationFrame[x]] = __reqFrame;
      }

      // Cancel the animations after expiration
      setTimeout(function() {
        for (i = 0; i < __animationRequests.length; i++) {
          __cancelAnimationFrame(__animationRequests[i]);
        }

        var ss = window.document.createElement("style");
        ss.textContent = "*, *::before, *::after { animation-play-state: paused !important; }";
        var ref = window.document.getElementsByTagName("script")[0];
        ref.parentNode.insertBefore(ss, ref);

        __animationsTimedOut = true;
      }, __animationDuration, "push");

      /**
      * Capture setInterval and setTimeout to kill after X number of seconds
      **/
      window.setInterval = (function(oldSetInterval) {
        var registered = [];

        function f(a,b) {
          // check if the time has expired,
          // after __animationDuration expires don't take anymore setIntervals
          if (this.timedOut) {
            return 0;
          } else {
            return registered[ registered.length ] = oldSetInterval(a,b);
          }
        }

        f.clearAll = function() {
          var r;

          while (r = registered.pop()) {
            clearInterval( r );
          }

          this.timedOut = true;
        };

        f.timedOut = false;

        return f;
      }(window.setInterval));

      window.setTimeout = (function(oldSetTimeout) {
        var registered = [];

        // because some of our timeouts may time out afterwards
        // we want to make sure they know the secret sauce to still use
        // setTimeout after the time has expired, thats why we have a
        // third param
        function f(a,b, push) {
          // check if the time has expired,
          // after __animationDuration expires don't take anymore requests
          if (this.timedOut && typeof(push) == "undefined") {
            return 0;
          } else {
            // If push is there, never clear that interval
            // so never add it to the registry
            if (push) {
              return oldSetTimeout(a,b);
            } else {
              return registered[ registered.length ] = oldSetTimeout(a,b);
            }
          }
        }

        f.clearAll = function() {
          var r;

          while (r = registered.pop()) {
            clearTimeout( r );
          }

          this.timedOut = true;
        };

        f.timedOut = false;

        return f;
      }(window.setTimeout));

      setTimeout(function() {
        setTimeout.clearAll();
        setInterval.clearAll();
      }, __animationDuration, "push");

    }());
  