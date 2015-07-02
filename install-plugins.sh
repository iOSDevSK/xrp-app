#!/bin/bash

pushd Build

cordova plugin add com.phonegap.plugins.barcodescanner/
cordova plugin add cordova-plugin-console
cordova plugin add nl.x-services.plugins.socialsharing
cordova plugin add https://github.com/EddyVerbruggen/LaunchMyApp-PhoneGap-Plugin.git --variable URL_SCHEME=ripple

popd

