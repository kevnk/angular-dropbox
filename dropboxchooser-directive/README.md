# Angular Directive for DropboxChooser

### How to Use

1. Add `dropboxChooser` as a dependency for your angular app. Here's an example of how that might look:
    
        var myApp = angular.module('myApp', ['dropboxChooser'])


2. Simply add `<dropboxchooser></dropboxchooser>` where you want the dropbox chooser link to show. This module will do the rest for you.

3. See [Documentation for Dropbox Chooser](https://www.dropbox.com/developers/chooser) for more details.

4. See the original dropbox script [in this repo](vendor/dropbox.js) or at [https://www.dropbox.com/static/api/1/dropbox.js](https://www.dropbox.com/static/api/1/dropbox.js)

### Known Issues

- I have not created a global variable `Dropbox` yet for you do do things like `Dropbox.choose(options);` like it mentions in Dropbox's Documentation. 




### Intentions

My intentions were to stay as close to the original file as possible, for purposes of maintenance if and when dropbox updates the file.

However, I know there's some event handling that angular would probably be better at.

