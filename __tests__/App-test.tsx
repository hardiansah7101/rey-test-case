/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';


jest.mock('react-native-gesture-handler', () => { });

jest.mock(
  '@react-navigation/stack/lib/commonjs/views/GestureHandlerNative', () => {
    const RN = require('react-native');
    return {
      PanGestureHandler: RN.View,
      GestureHandlerRootView: RN.View,
    };
  },
);

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('@react-navigation/core/lib/commonjs/BaseNavigationContainer')
jest.mock('react-native', () => ({
  NativeModules: {
    RNPasscodeStatus: {
      supported: jest.fn(),
      status: jest.fn(),
      get: jest.fn(),
    }
  },
  StyleSheet: {
    create: () => ({})
  },
  Platform: {
    OS: jest.fn(() => 'android'),
    version: jest.fn(() => 25),
  },
}))


it('renders correctly', () => {
  renderer.create(<App />);
});

