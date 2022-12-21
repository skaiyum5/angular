// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // rootUrl: 'https://115.127.8.84/CloudNetAPITest',
  rootUrl: 'http://192.168.20.218/CloudNetAPI',
  // rootUrl: 'http://localhost:54735',
  reportApiUrl: 'http://192.168.20.218/CloudNetReportAPI',
  UserIPUrl:'https://api.ipify.org/?format=json'// http://115.127.8.84/userip/api/ip'

  // RAKUB
  // rootUrl: 'http://10.0.1.57/CloudNetAPI',
  // reportApiUrl: 'http://10.0.1.57/CloudNetReportAPI',
  // rootUrl: 'http://203.112.209.123/CloudNetApiExt',
  // reportApiUrl: 'http://203.112.209.123/CloudNetReportAPIExt',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
