cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-geolocation.geolocation",
      "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
      "pluginId": "cordova-plugin-geolocation",
      "clobbers": [
        "navigator.geolocation"
      ]
    },
    {
      "id": "cordova-plugin-geolocation.PositionError",
      "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
      "pluginId": "cordova-plugin-geolocation",
      "runs": true
    },
    {
      "id": "cordova-plugin-bluetooth-serial.bluetoothSerial",
      "file": "plugins/cordova-plugin-bluetooth-serial/www/bluetoothSerial.js",
      "pluginId": "cordova-plugin-bluetooth-serial",
      "clobbers": [
        "window.bluetoothSerial"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-plugin-geolocation": "4.0.1",
    "cordova-plugin-bluetooth-serial": "0.4.7"
  };
});