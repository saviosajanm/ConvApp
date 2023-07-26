import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import Navigator from './routes/homeStack';
import Home from './Home';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {

  return (
    <Navigator />
  );
}


export default App;
