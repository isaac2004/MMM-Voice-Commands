## What is this Repo?

Most people in the MagicMirror Community are aware of [Hello-Lucy](https://github.com/mykle1/Hello-Lucy) and the great work there to interface with MMM-Voice. I have used [MMM-Voice-Commands](https://github.com/Veldrovive/MMM-Voice-Commands) (props to Veldrovive for the awesome work!) in a similar way and wanted to share how I configured the module to accommodate.

## IMPORTANT NOTE - Read before installing:

Just like MMM-Voice-Commands, annyang does not work when Magic Mirror is run using some browsers. In order to ensure that it works, use chrome or firefox if possible. This also means that electron cannot be used since it is a chromium wrapper. The serveronly mode must be used for this module to function.

```
npm nodeserveronly
```

## What do I do with this?

To hook this experience up to your existing MMM-Voice-Commands setup, just replace the js file in the root of that module with the one in this repo. Please refer to the [MMM-Voice-Commands Repo](https://github.com/Veldrovive/MMM-Voice-Commands) on how to setup that module.

After that, to add modules, please follow the [Hello-Lucy documentation](https://github.com/mykle1/Hello-Lucy) to update the MMM-Voice-Commands.js and the respective module js file.

## Works immediately with these modules

* **calendar**        (default MM module)
* **clock**           (default MM module)
* **compliments**     (default MM module)
* **newsfeed**        (default MM module)
* **MMM-AfterShip**   (Track all your deliveries in one module)
* **MMM-AlarmClock** (I use this with alert module disabled and click button)
* **MMM-ATM**         (Another Trivia Module? Really?)
* **MMM-CARDS**       (Play 5 card stud poker against your mirror)
* **MMM-Census**      (World Population by age and sex, or by individual country)
* **MMM-Cocktails**   (How to make all kinds of mixed drinks)
* **MMM-EARTH**       (Realtime images of Earth from 1,000,000 miles away)
* **MMM-EarthWinds**  (Real time winds on our planet as a live background)
* **MMM-EasyBack**    (The easiest way to use background/desktop pictures on your mirror.)
* **MMM-EasyPix**     (Necessary for animated graphic and sound response)
* **MMM-EOL**         (The Encyclopedia of Life)
* **MMM-Events**      (Concerts, Sports, Theatre, coming to your city)
* **MMM-EventHorizon**(Countdown timer for any occasion)
* **MMM-EyeCandy**    (Pretty damn cool)
* **MMM-FMI**         (Finds your iPhone. Gives location and distance. Beeps iPhone)
* **MMM-Fortune**     (A fortune cookie on your mirror)
* **MMM-Gas**         (Gas Price module by @cowboysdude)
* **MMM-GoogleMapsTraffic**         [My Custom Extension of the well-known GoogleMapsTrafficModule](https://github.com/isaac2004/MMM-GoogleMapsTraffic)
* **MMM-ISS**         (Know when the International Space Station can be seen at your location)
* **MMM-JEOPARDY**    (The widely popular gameshow on your mirror)
* **MMM-LICE**        (Live International Currency Exchange)
* **MMM-Lottery**     (Random Lottery Numbers)
* **MMM-Lunartic**    (Lunar information and graphics)
* **MMM-NASA**        (Your universe in a single module)
* **MMM-NEO**         (Near Earth Objects passing by this week. Be afraid. Be VERY afraid!)
* **MMM-NOAA**        (MM's most popular weather module)
* **MMM-PC-Stats**    (For PC boards running MM. Works with ubuntu)
* **MMM-PetFinder**   (Pets for adoption in your area. All kinds.)
* **MMM-PilotWX**     (Conditions and Weather for Pilots)
* **MMM-rfacts**      (Random Facts module. Informative and fun!)
* **MMM-SORT**        (Static Or Rotating Tides module, worldwide)
* **MMM-Sudoku**      (Play Sudoku on your mirror. For use with keyboard and mouse)
* **MMM-SunRiseSet**  (Spherical or Day/Night map of planet Earth)
* **MMM-URHere**      (Displays map with your location, IP Address, Internet Provider and National Flag)
* **MMM-voice**       (of course)
* **MMM-WunderGround**
