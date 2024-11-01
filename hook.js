'use strict';

const fs = require('fs');
const xml2js = require('xml2js');

module.exports = function (context) {
  const parseString = xml2js.parseString;
  const builder = new xml2js.Builder(); 
  const manifestPath = context.opts.projectRoot + '/platforms/android/app/src/main/AndroidManifest.xml';
  const androidManifest = fs.readFileSync(manifestPath).toString();
  let manifestRoot;

  if (androidManifest) {
    parseString(androidManifest, (err, manifest) => {      
      if (err) {
        return console.error(err);
      }
      manifestRoot = manifest['manifest'];
      manifestRoot['$']['xmlns:tools'] = 'http://schemas.android.com/tools';

      if (!manifestRoot['uses-permission']) {
        manifestRoot['uses-permission'] = [];
      }

      manifestRoot['uses-permission'] = manifestRoot['uses-permission'].filter(function(item) {
        return item['$']['android:name'] !== 'com.google.android.gms.permission.AD_ID';
      });
      
      fs.writeFileSync(manifestPath, builder.buildObject(manifest));
    });
  }
};
