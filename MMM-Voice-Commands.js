Module.register("MMM-Voice-Commands-Commands", {
  defaults: {
    debug: false, //Displays end results and errors from annyang in the Log
    autoStart: true, //Adds annyang commands when it first starts
    activateCommand: "hello mirror", //Command to active all other commands
    deactivateCommand: "goodbye mirror", //Command to deactivate all other commands
    alertHeard: false, //Wether an alert should be shown when annyang hears a phrase (mostly for debug)
    commands: {
      "socket test :payload": "TEST_SOCKET",
      "function test :payload": function(payload) {
        alert("Test: " + payload);
      } //in these functions 'this' is bound to the module so this.sendNotification() is valid
    }
  },

  start: function() {
    this.rawCommands = this.config.commands;
    this.autoStart = this.config.autoStart;
    this.activateCommand = this.config.activateCommand;
    this.deactivateCommand = this.config.deactivateCommand;
    this.alertHeard = this.config.alertHeard;
    this.debug = this.config.debug;

    this.commands = {};
    this.active = false;

    this.initAnnyang();
  },
  notificationReceived: function(notification, payload) {
    if (notification === "DOM_OBJECTS_CREATED") {
      this.sendSocketNotification("START", {
        config: this.config,
        modules: this.modules
      });
    } else if (notification === "REGISTER_VOICE_MODULE") {
      if (
        Object.prototype.hasOwnProperty.call(payload, "mode") &&
        Object.prototype.hasOwnProperty.call(payload, "sentences")
      ) {
        this.modules.push(payload);
      }
    }

  initAnnyang: function() {
    const self = this;
    if (annyang) {
      //Iterate over commands list to create a valid annyang command object
      for (var key in self.rawCommands) {
        if (self.rawCommands.hasOwnProperty(key)) {
          //If the property is already a function, leave it that way. Otherwise assume it is a socket name
          if (typeof self.rawCommands[key] !== "function") {
            //Construct a valid function...
            function createCommand(socket) {
              return function(payload) {
                self.sendNotification(socket, payload);
              };
            }

            //...And then put it in the object
            self.commands[key] = createCommand(self.rawCommands[key]);
          } else {
            self.commands[key] = self.rawCommands[key].bind(self);
          }
        }
      }

      if (self.autoStart) {
        annyang.addCommands(self.commands);
        self.active = true;
      }

      const standardCommands = {};
      standardCommands[self.activateCommand] = function() {
        if (!self.active) {
          self.addCommands(self.commands);
          self.active = true;
          self.sendNotification("SHOW_ALERT", {
            type: "notification",
            title: "Voice Commands",
            message: "Activated"
          });
        } else {
          self.sendNotification("SHOW_ALERT", {
            type: "notification",
            title: "Voice Commands",
            message: "Already Active"
          });
        }
      };

      standardCommands[self.deactivateCommand] = function() {
        if (self.active) {
          self.removeCommands(self.commands);
          self.active = false;
          self.sendNotification("SHOW_ALERT", {
            type: "notification",
            title: "Voice Commands",
            message: "Deactivated"
          });
        } else {
          self.sendNotification("SHOW_ALERT", {
            type: "notification",
            title: "Voice Commands",
            message: "Already Deactivated"
          });
        }
      };

      annyang.addCommands(standardCommands);

      annyang.start();

      if (self.debug) {
        annyang.addCallback("result", function(e) {
          Log.log(e);
        });

        annyang.addCallback("error", function(e) {
          Log.log(e);
        });
      }

      // This is the code that I added to add a similar experience to Hello-Lucy
      if (self.alertHeard) {
        annyang.addCallback("result", function(e) {
          for (var i = 0; i < e.length; i++) {

            // Get First result from annyang, which will be closest speech match
            // Format notification into format to match MMM-HelloLucy
            var notification = e[i]
              .toUpperCase()
              .trim()
              .replace(" ", "_");

            // MMM-Voice-Commands sends notification to MMM-GoogleMapsTraffic to HIDE
            if (notification === "HIDE_TRAFFIC") {
              self.sendNotification("HIDE_TRAFFIC");
            }

            // Check if notification is requesting location
            else if (notification.indexOf("SHOW_TRAFFIC") > -1) {
              // MMM-Voice-Commands sends notification to MMM-GoogleMapsTraffic to SHOW Default location per config
              if (notification === "SHOW_TRAFFIC") {
                self.sendNotification("SHOW_TRAFFIC");
              }

              // MMM-Voice-Commands sends notification to MMM-GoogleMapsTraffic to SHOW passed location from voice
              else {
                var indexOfNotification = notification.indexOf("SHOW_TRAFFIC");
                var strippedPayload = notification
                  .replace("_", " ")
                  .substr(ind + 8, notification.length)
                  .trim();
                var location = st
                  .replace("of", "")
                  .trim()
                  .replace("for", "")
                  .trim();
                self.sendNotification("SHOW_TRAFFIC", location);
              }
            }


            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Add Additional Modules similar to below

            // MMM-Voice-Commands sends notification to MMM-Cocktails to HIDE
            else if (notification === "HIDE_COCKTAILS") {
              self.sendNotification("HIDE_COCKTAILS");
            }

            // MMM-Voice-Commands sends notification to MMM-Cocktails to SHOW
            else if (notification === "SHOW_COCKTAILS") {
              self.sendNotification("SHOW_COCKTAILS");
            }

            // MMM-Voice-Commands sends notification to MMM-Clock to HIDE
            else if (notification === "HIDE_CLOCK") {
              self.sendNotification("HIDE_CLOCK");
            }

            // MMM-Voice-Commands sends notification to MMM-Clock to SHOW
            else if (notification === "SHOW_CLOCK") {
              self.sendNotification("SHOW_CLOCK");
            }

            // MMM-Voice-Commands sends notification to MMM-Newsfeed to HIDE
            else if (notification === "HIDE_NEWSFEED") {
              self.sendNotification("HIDE_NEWSFEED");
            }

            // MMM-Voice-Commands sends notification to MMM-Newsfeed to SHOW
            else if (notification === "SHOW_NEWSFEED") {
              self.sendNotification("SHOW_NEWSFEED");
            }

            // MMM-Voice-Commands sends notification to MMM-AlarmClock to HIDE
            else if (notification === "HIDE_ALARM") {
              this.sendNotification("HIDE_ALARM");
            }

            // MMM-Voice-Commands sends notification to MMM-AlarmClock to SHOW
            else if (notification === "SHOW_ALARM") {
              this.sendNotification("SHOW_ALARM");
            }

            // MMM-Voice-Commands sends notification to MMM-Back to HIDE
            else if (notification === "HIDE_BACKGROUND") {
              this.sendNotification("HIDE_BACKGROUND");
            }

            // MMM-Voice-Commands sends notification to MMM-Back to SHOW
            else if (notification === "SHOW_BACKGROUND") {
              this.sendNotification("SHOW_BACKGROUND");
            }

            // MMM-Voice-Commands sends notification to calendar to HIDE
            else if (notification === "HIDE_CALENDAR") {
              this.sendNotification("HIDE_CALENDAR");
            }

            // MMM-Voice-Commands sends notification to calendar to SHOW
            else if (notification === "SHOW_CALENDAR") {
              this.sendNotification("SHOW_CALENDAR");
            }

            // MMM-Voice-Commands sends notification to MMM-CARDS to HIDE
            else if (notification === "HIDE_CARDS") {
              this.sendNotification("HIDE_CARDS");
            }

            // MMM-Voice-Commands sends notification to MMM-CARDS to SHOW
            else if (notification === "SHOW_CARDS") {
              this.sendNotification("SHOW_CARDS");
            }

            // MMM-Voice-Commands sends notification to MMM-Census to HIDE
            else if (notification === "HIDE_CENSUS") {
              this.sendNotification("HIDE_CENSUS");
            }

            // MMM-Voice-Commands sends notification to MMM-Census to SHOW
            else if (notification === "SHOW_CENSUS") {
              this.sendNotification("SHOW_CENSUS");
            }

            // MMM-Voice-Commands sends notification to MMM-CLOCK to HIDE
            else if (notification === "HIDE_CLOCK") {
              this.sendNotification("HIDE_CLOCK");
            }

            // MMM-Voice-Commands sends notification to MMM-CLOCK to SHOW
            else if (notification === "SHOW_CLOCK") {
              this.sendNotification("SHOW_CLOCK");
            }

            // MMM-Voice-Commands sends notification to MMM-COCKTAILS to HIDE
            else if (notification === "HIDE_COCKTAILS") {
              this.sendNotification("HIDE_COCKTAILS");
            }

            // MMM-Voice-Commands sends notification to MMM-COCKTAILS to SHOW
            else if (notification === "SHOW_COCKTAILS") {
              this.sendNotification("SHOW_COCKTAILS");
            }

            // MMM-Voice-Commands sends notification to compliments to HIDE
            else if (notification === "HIDE_COMPLIMENTS") {
              this.sendNotification("HIDE_COMPLIMENTS");
            }

            // MMM-Voice-Commands sends notification to compliments to SHOW
            else if (notification === "SHOW_COMPLIMENTS") {
              this.sendNotification("SHOW_COMPLIMENTS");
            }

            // MMM-Voice-Commands sends notification to MMM-NOAA to HIDE
            else if (notification === "HIDE_COWBOY") {
              this.sendNotification("HIDE_COWBOY");
            }

            // MMM-Voice-Commands sends notification to MMM-NOAA to SHOW
            else if (notification === "SHOW_COWBOY") {
              this.sendNotification("SHOW_COWBOY");
            }

            // MMM-Voice-Commands sends notification to MMM-EOL to HIDE
            else if (notification === "HIDE_DARWIN") {
              this.sendNotification("HIDE_DARWIN");
            }

            // MMM-Voice-Commands sends notification to MMM-EOL to SHOW
            else if (notification === "SHOW_DARWIN") {
              this.sendNotification("SHOW_DARWIN");
            }

            // MMM-Voice-Commands sends notification to MMM-EARTH to HIDE
            else if (notification === "HIDE_EARTH") {
              this.sendNotification("HIDE_EARTH");
            }

            // MMM-Voice-Commands sends notification to MMM-EARTH to SHOW
            else if (notification === "SHOW_EARTH") {
              this.sendNotification("SHOW_EARTH");
            }

            // MMM-Voice-Commands sends notification to MMM-EyeCandy to HIDE
            else if (notification === "HIDE_EYECANDY") {
              this.sendNotification("HIDE_EYECANDY");
            }

            // MMM-Voice-Commands sends notification to MMM-EyeCandy to SHOW
            else if (notification === "SHOW_EYECANDY") {
              this.sendNotification("SHOW_EYECANDY");
            }

            // MMM-Voice-Commands sends notification to MMM-Events to HIDE
            else if (notification === "HIDE_EVENTS") {
              this.sendNotification("HIDE_EVENTS");
            }

            // MMM-Voice-Commands sends notification to MMM-Events to SHOW
            else if (notification === "SHOW_EVENTS") {
              this.sendNotification("SHOW_EVENTS");
            }

            // MMM-Voice-Commands sends notification to MMM-rfacts to HIDE
            else if (notification === "HIDE_FAX") {
              this.sendNotification("HIDE_FAX");
            }

            // MMM-Voice-Commands sends notification to MMM-rfacts to SHOW
            else if (notification === "SHOW_FAX") {
              this.sendNotification("SHOW_FAX");
            }

            // MMM-Voice-Commands sends notification to MMM-Glock to HIDE
            else if (notification === "HIDE_FLIPPER") {
              this.sendNotification("HIDE_FLIPPER");
            }

            // MMM-Voice-Commands sends notification to MMM-Glock to SHOW
            else if (notification === "SHOW_FLIPPER") {
              this.sendNotification("SHOW_FLIPPER");
            }

            // MMM-Voice-Commands sends notification to MMM-FlightsAbove to HIDE
            else if (notification === "HIDE_FLIGHTS") {
              this.sendNotification("HIDE_FLIGHTS");
            }

            // MMM-Voice-Commands sends notification to MMM-FlightsAbove to SHOW
            else if (notification === "SHOW_FLIGHTS") {
              this.sendNotification("SHOW_FLIGHTS");
            }

            // MMM-Voice-Commands sends notification to MMM-Fortune to HIDE
            else if (notification === "HIDE_FORTUNE") {
              this.sendNotification("HIDE_FORTUNE");
            }

            // MMM-Voice-Commands sends notification to MMM-Fortune to SHOW
            else if (notification === "SHOW_FORTUNE") {
              this.sendNotification("SHOW_FORTUNE");
            }

            // MMM-Voice-Commands sends notification to MMM-Gas to HIDE
            else if (notification === "HIDE_GAS") {
              this.sendNotification("HIDE_GAS");
            }

            // MMM-Voice-Commands sends notification to MMM-Gas to SHOW
            else if (notification === "SHOW_GAS") {
              this.sendNotification("SHOW_GAS");
            }

            // MMM-Voice-Commands sends notification to MMM-JEOPARDY to HIDE
            else if (notification === "HIDE_JEOPARDY") {
              this.sendNotification("HIDE_JEOPARDY");
            }

            // MMM-Voice-Commands sends notification to MMM-JEOPARDY to SHOW
            else if (notification === "SHOW_JEOPARDY") {
              this.sendNotification("SHOW_JEOPARDY");
            }

            // MMM-Voice-Commands sends notification to MMM-LICE to HIDE
            else if (notification === "HIDE_LICE") {
              this.sendNotification("HIDE_LICE");
            }

            // MMM-Voice-Commands sends notification to MMM-LICE to SHOW
            else if (notification === "SHOW_LICE") {
              this.sendNotification("SHOW_LICE");
            }

            // MMM-Voice-Commands sends notification to MMM-URHere to HIDE
            else if (notification === "HIDE_LOCATION") {
              this.sendNotification("HIDE_LOCATION");
            }

            // MMM-Voice-Commands sends notification to MMM-URHere to SHOW
            else if (notification === "SHOW_LOCATION") {
              this.sendNotification("SHOW_LOCATION");
            }

            // MMM-Voice-Commands sends notification to MMM-Lottery to HIDE
            else if (notification === "HIDE_LOTTERY") {
              this.sendNotification("HIDE_LOTTERY");
            }

            // MMM-Voice-Commands sends notification to MMM-Lottery to SHOW
            else if (notification === "SHOW_LOTTERY") {
              this.sendNotification("SHOW_LOTTERY");
            }

            // MMM-Voice-Commands sends notification to MMM-EasyPix to HIDE
            else if (notification === "HIDE_LUCY") {
              this.sendNotification("HIDE_LUCY");
            }

            // MMM-Voice-Commands sends notification to MMM-EasyPix to SHOW
            else if (notification === "SHOW_LUCY") {
              this.sendNotification("SHOW_LUCY");
            }

            // MMM-Voice-Commands sends notification to MMM-Lunartic to HIDE
            else if (notification === "HIDE_MOON") {
              this.sendNotification("HIDE_MOON");
            }

            // MMM-Voice-Commands sends notification to MMM-Lunartic to SHOW
            else if (notification === "SHOW_MOON") {
              this.sendNotification("SHOW_MOON");
            }

            // MMM-Voice-Commands sends notification to MMM-NASA to HIDE
            else if (notification === "HIDE_NASA") {
              this.sendNotification("HIDE_NASA");
            }

            // MMM-Voice-Commands sends notification to MMM-NASA to SHOW
            else if (notification === "SHOW_NASA") {
              this.sendNotification("SHOW_NASA");
            }

            // MMM-Voice-Commands sends notification to MMM-NEO to HIDE
            else if (notification === "HIDE_NEO") {
              this.sendNotification("HIDE_NEO");
            }

            // MMM-Voice-Commands sends notification to MMM-NEO to SHOW
            else if (notification === "SHOW_NEO") {
              this.sendNotification("SHOW_NEO");
            }

            // MMM-Voice-Commands sends notification to newsfeed to HIDE
            else if (notification === "HIDE_NEWS") {
              this.sendNotification("HIDE_NEWS");
            }

            // MMM-Voice-Commands sends notification to newsfeed to SHOW
            else if (notification === "SHOW_NEWS") {
              this.sendNotification("SHOW_NEWS");
            }

            // MMM-Voice-Commands sends notification to MMM-PETFINDER to HIDE
            else if (notification === "HIDE_PETFINDER") {
              this.sendNotification("HIDE_PETFINDER");
            }

            // MMM-Voice-Commands sends notification to MMM-PETFINDER to SHOW
            else if (notification === "SHOW_PETFINDER") {
              this.sendNotification("SHOW_PETFINDER");
            }

            // MMM-Voice-Commands sends notification to MMM-FMI to HIDE
            else if (notification === "HIDE_PHONE") {
              this.sendNotification("HIDE_PHONE");
            }

            // MMM-Voice-Commands sends notification to MMM-FMI to SHOW
            else if (notification === "SHOW_PHONE") {
              this.sendNotification("SHOW_PHONE");
            }

            // MMM-Voice-Commands sends notification to MMM-ImageSlideshow to HIDE
            else if (notification === "HIDE_PICTURES") {
              this.sendNotification("HIDE_PICTURES");
            }

            // MMM-Voice-Commands sends notification to MMM-ImageSlideshow to SHOW
            else if (notification === "SHOW_PICTURES") {
              this.sendNotification("SHOW_PICTURES");
            }

            // MMM-Voice-Commands sends notification to MMM-PilotWX to HIDE
            else if (notification === "HIDE_PILOTS") {
              this.sendNotification("HIDE_PILOTS");
            }

            // MMM-Voice-Commands sends notification to MMM-PilotWX to SHOW
            else if (notification === "SHOW_PILOTS") {
              this.sendNotification("SHOW_PILOTS");
            }

            // MMM-Voice-Commands sends notification to MMM-AfterShip to HIDE
            else if (notification === "HIDE_SHIPPING") {
              this.sendNotification("HIDE_SHIPPING");
            }

            // MMM-Voice-Commands sends notification to MMM-AfterShip to SHOW
            else if (notification === "SHOW_SHIPPING") {
              this.sendNotification("SHOW_SHIPPING");
            }

            // MMM-Voice-Commands sends notification to MMM-ISS to HIDE
            else if (notification === "HIDE_STATION") {
              this.sendNotification("HIDE_STATION");
            }

            // MMM-Voice-Commands sends notification to MMM-ISS to SHOW
            else if (notification === "SHOW_STATION") {
              this.sendNotification("SHOW_STATION");
            }

            // MMM-Voice-Commands sends notification to MMM-PC-Stats to HIDE
            else if (notification === "HIDE_STATS") {
              this.sendNotification("HIDE_STATS");
            }

            // MMM-Voice-Commands sends notification to MMM-PC-Stats to SHOW
            else if (notification === "SHOW_STATS") {
              this.sendNotification("SHOW_STATS");
            }

            // MMM-Voice-Commands sends notification to MMM-Sudoku to HIDE
            else if (notification === "HIDE_SUDOKU") {
              this.sendNotification("HIDE_SUDOKU");
            }

            // MMM-Voice-Commands sends notification to MMM-Sudoku to SHOW
            else if (notification === "SHOW_SUDOKU") {
              this.sendNotification("SHOW_SUDOKU");
            }

            // MMM-Voice-Commands sends notification to MMM-SunRiseSet to HIDE
            else if (notification === "HIDE_SUNRISE") {
              this.sendNotification("HIDE_SUNRISE");
            }

            // MMM-Voice-Commands sends notification to MMM-SunRiseSet to SHOW
            else if (notification === "SHOW_SUNRISE") {
              this.sendNotification("SHOW_SUNRISE");
            }

            // MMM-Voice-Commands sends notification to MMM-SORT to HIDE
            else if (notification === "HIDE_TIDES") {
              this.sendNotification("HIDE_TIDES");
            }

            // MMM-Voice-Commands sends notification to MMM-SORT to SHOW
            else if (notification === "SHOW_TIDES") {
              this.sendNotification("SHOW_TIDES");
            }

            // MMM-Voice-Commands sends notification to MMM-EventHorizon to HIDE
            else if (notification === "HIDE_TIMER") {
              this.sendNotification("HIDE_TIMER");
            }

            // MMM-Voice-Commands sends notification to MMM-EventHorizon to SHOW
            else if (notification === "SHOW_TIMER") {
              this.sendNotification("SHOW_TIMER");
            }

            // MMM-Voice-Commands sends notification to MMM-ATM to HIDE
            else if (notification === "HIDE_TRIVIA") {
              this.sendNotification("HIDE_TRIVIA");
            }

            // MMM-Voice-Commands sends notification to MMM-ATM to SHOW
            else if (notification === "SHOW_TRIVIA") {
              this.sendNotification("SHOW_TRIVIA");
            }

            // MMM-Voice-Commands sends notification to MMM-Voice-Commands to HIDE
            else if (notification === "HIDE_VOICE") {
              this.hide(1000);
            }

            // MMM-Voice-Commands sends notification to MMM-Voice-Commands to SHOW
            else if (notification === "SHOW_VOICE") {
              this.show(1000);
            }

            // MMM-Voice-Commands sends notification to MMM-BMW-DS to HIDE
            else if (notification === "HIDE_WEATHER") {
              this.sendNotification("HIDE_WEATHER");
            }

            // MMM-Voice-Commands sends notification to MMM-BMW-DS to SHOW
            else if (notification === "SHOW_WEATHER") {
              this.sendNotification("SHOW_WEATHER");
            }

            // MMM-Voice-Commands sends notification to MMM-EarthWinds to HIDE
            else if (notification === "HIDE_WIND") {
              this.sendNotification("HIDE_WIND");
            }

            // MMM-Voice-Commands sends notification to MMM-EarthWinds to SHOW
            else if (notification === "SHOW_WIND") {
              this.sendNotification("SHOW_WIND");
            }
          }
        });
      }
    }
  },

  addCommands: function(commands) {
    annyang.abort();
    annyang.addCommands(commands);
    annyang.start();
  },

  removeCommands: function(commands) {
    annyang.abort();
    if (typeof commands === "object")
      annyang.removeCommands(
        Array.isArray(commands) ? commands : Object.keys(commands)
      );
    annyang.start();
  },

  getScripts: function() {
    return [this.file("js/annyang.min.js")];
  }
});
