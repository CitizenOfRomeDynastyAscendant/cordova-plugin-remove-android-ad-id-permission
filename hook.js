'use strict';

const fs = require('fs');
const xml2js = require('xml2js');

module.exports = function (context) {
  const parseString = xml2js.parseString;
  const builder = new xml2js.Builder(); 
  const manifestPath = context.opts.projectRoot + '/platforms/android/app/AndroidManifest.xml';
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

      var permission = manifestRoot['uses-permission'].find(function(item) {
        return item['$']['android:name'] === 'android.permission.WRITE_EXTERNAL_STORAGE';
      });

      if(permission) {
        permission['$']['tools:node'] = 'replace';
        fs.writeFileSync(manifestPath, builder.buildObject(manifest));
      }
    });
  }
};
