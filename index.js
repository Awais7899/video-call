/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import BackgroundEventHandler from './services/backgroundHandler';
import IncomingCallNotification from './services/IncomingCall';

AppRegistry.registerComponent(appName, () => App);
