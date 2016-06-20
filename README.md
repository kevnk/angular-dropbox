angular-dropbox
===============

## This repository is no longer maintained

Angular connection with Dropbox API; DropboxChooser Directive


## What's to come
The "plan" is to create an angular version of Dropbox's API. For now though, I'm starting with a dropboxChooser service.

Here's [Dropbox's documentation on the Dropbox Chooser](https://www.dropbox.com/developers/chooser).  


## DropboxChooser Service

### How to Use

1. Add `dropboxChooserModule` as a dependency for your angular app. Here's an example of how that might look:
    
        var myApp = angular.module('myApp', ['dropboxChooserModule'])


2. Simply add `<dropbox-chooser local-model="myLocalModel"></dropbox-chooser>` where you want the dropbox chooser link to show. This module will do the rest for you.

3. See [Documentation for Dropbox Chooser](https://www.dropbox.com/developers/chooser) for more details.

4. See the original dropbox script [in this repo](vendor/dropbox.js) or at [https://www.dropbox.com/static/api/1/dropbox.js](https://www.dropbox.com/static/api/1/dropbox.js)

### Notes

- There is no global variable `Dropbox`, but you should be able to use `dropboxChooserService.choose(options);` within your angular app to accomplish the same things as described in Dropbox's documentation for the `Dropbox` global variable



### Intentions

My intentions were to stay as close to the original file as possible, for purposes of maintenance if and when dropbox updates the file.

However, I know there's some event handling that angular would probably be better at.




## How to contribute

Just send me a pull request. Thanks!
