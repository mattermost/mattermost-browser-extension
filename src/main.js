'use strict';

function startApplication() {
    var applicationStartTime = new Date().getTime();
    chrome.app.window.create('/src/main.html', {
        id: 'main-window',
        frame: 'chrome',
        innerBounds: {
            minWidth: 800,
            minHeight: 600
        }
    }, function (createdWindow) {
        createdWindow.onClosed.addListener(function () {
            // do something when the app closes?
        });
    });
}

chrome.app.runtime.onLaunched.addListener(startApplication);
