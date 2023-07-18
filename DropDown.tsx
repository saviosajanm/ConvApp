import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import TT from './TT.json';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Picker,
} from 'react-native';


/*
import {
    Picker
  } from 'react-native/picker';
*/
function DropDown(props): JSX.Element {
  const [selectedValue, setSelectedValue] = '';
  return (
    <View>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
        <Picker.Item label="Monday" value="Monday" />
        <Picker.Item label="Tuesday" value="Tuesday" />
        <Picker.Item label="Wednesday" value="Wednesday" />
        <Picker.Item label="Thursday" value="Thursday" />
        <Picker.Item label="Friday" value="Friday" />
      </Picker>
      <DisplaySelectedOption selectedOption={selectedValue} />
    </View>
  );
}

export default DropDown;
