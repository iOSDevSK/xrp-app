# Build instructions

```sh
npm install -g cordova
cordova create Build com.adamcmiel.app.xrp XRP
cd Build \
    && cordova platform add ios \
    && cordova plugin add org.apache.cordova.contacts \
    && cordova plugin add https://github.com/wildabeast/BarcodeScanner.git
```

To build:
```sh
npm start
```

To test:
```sh
npm test
```

To develop in the browser:
```sh
npm run start-dev
```

##Plugins:
```
com.phonegap.plugins.barcodescanner/
org.apache.cordova.console/
org.apache.cordova.contacts/
nl.x-services.plugins.socialsharing
https://github.com/EddyVerbruggen/LaunchMyApp-PhoneGap-Plugin.git --variable URL_SCHEME=ripple
nl.x-services.plugins.actionsheet
```
