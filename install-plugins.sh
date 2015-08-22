#!/bin/bash
plugins=(
  com.phonegap.plugins.barcodescanner/
  cordova-plugin-console
  nl.x-services.plugins.socialsharing
  https://github.com/EddyVerbruggen/LaunchMyApp-PhoneGap-Plugin.git --variable URL_SCHEME=ripple
)

pushd Build

for plugin in $plugins
do;
cordova plugin add $plugin
done;

popd

