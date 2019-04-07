RockFall
========

:warning: This repository is now archived and read-only (and its depencies are highly outdated).

A Web Game built with [io.js](https://iojs.org/), HTML5, JavaScript and with <3

![Rockfall](rockfall_screen.jpg "Rockfall")

## run

1. install [node.js](https://nodejs.org) or [io.js](https://iojs.org/)
2. go to the folder : `cd /myp-path/rockfall-master/`
3. install dependencies with: `npm install`
4. run the server with: `node server.js` or `iojs server.js`

or if you want tu use live reload

* install [gulp](http://gulpjs.com) (after _2._) with : `npm install -g gulp`
* run the gulfile  _"gulfile.js"_ with: `gulp`


## todo

* Chat
* Improve UI
* Clean code
* Finish Connection System
* Add musics
* Add smooth animations

## auto-push

run : `scripts/push.bat "my commit message"`

The _.bat_ file located at "/scripts/push.bat"
is a one-command git push which executes these git commands in order:

* git add --all
* git commit -m "Specified message"
* git push origin master

## live-reload

The gulfile located at '_/myp-path/rockfall-master/gulfile.js'_
is a script to start and watch for file changes.

If there's a change, the default browser will automatically reload.

Plus, actions are synced between browsers.

To use it, start by installing gulp with the following command:

`npm install -g gulp`
