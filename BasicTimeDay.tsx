import React, { useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import TT from './TT.json';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Dimensions,
  View,
} from 'react-native';

function BasicTime(props): JSX.Element {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('en-US', options);
  var currentDay = props.currentDay;
  //const currentDay = "Friday";

  const ampm = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h12',
  });

  //const currentHour = now.getHours();
  //const currentMinute = now.getMinutes();
  //const currentHour = 17;
  //const currentMinute = 35;
  const [currentTime, setCurrentTime] = useState(new Date());
  const updateTime = () => {
    setCurrentTime(new Date());
  };
  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const dateHead = {
    color: 'cyan',
    fontSize: 40,
  };

  const timeText = {
    color: '#00FF00',
    fontSize: 30,
    fontFamily: 'digital-clock-font', // Replace 'YourCustomFontName' with the actual font family name
  };

  const timeStyle = {
    backgroundColor: 'black',
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 10,
    borderColor: 'limegreen',
    borderWidth: 2,
  };

  const dayStyle = {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'black',
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 75,
    borderColor: 'yellow',
    borderWidth: 1,
  };

  const dateStyle = {
    alignItems: 'center',
    backgroundColor: 'black'
  };

  const dayText = {
    fontSize: 25,
    color: 'yellow',
  };

  return (
    <ScrollView style={{backgroundColor: 'black'}}>
      <View style={dateStyle}>
        <Text style={dateHead}>{currentDate}</Text>
      </View>
      <View style={dayStyle}>
        <Text style={dayText}>{currentDay}</Text>
      </View>
      <View style={timeStyle}>
        <Text style={timeText}>{ampm}</Text>
      </View>
    </ScrollView>
  );
}

export default BasicTime;
