/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { getData } from './TTExport';
import BasicTime from './BasicTimeDay.tsx';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Dimensions,
  View,
  Image,
  Animated,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

let TT = null;

var timing = [
  [8, 0, 8, 50],
  [8, 55, 9, 45],
  [9, 50, 10, 40],
  [10, 45, 11, 35],
  [11, 40, 12, 30],
  [12, 35, 13, 25],
  [13, 30, 13, 55],
  [14, 0, 14, 50],
  [14, 55, 15, 45],
  [15, 50, 16, 40],
  [16, 45, 17, 35],
  [17, 40, 18, 30],
  [18, 35, 19, 25]];


var start = -1;
var end = -1;

function timeline(cd) {
  var tl = [];
  for (let i = 0; i < timing.length; i++) {
    if (i === 0) {
      tl.push([0, 0]);
    }
    tl.push([timing[i][0], timing[i][1]]);
    tl.push([timing[i][2], timing[i][3]]);
    if (i === timing.length - 1) {
      tl.push([23, 59]);
    }
  }
  return tl;
}

function states(TTX, tl, cd) {
  var states = [];
  var slot = -1;
  var ender = -1;
  var nonFree = [];
  var counti = 0;
  var dups = [];
  var dupstate = false;
  for (let i = 0; i < timing.length; i++) {
    if (i === 0) {
      counti += 1;
    } else {
      counti += 2;
    }
    if (dupstate) {
      dups.push(counti);
      dupstate = false;
      ender = counti
      nonFree.push(ender);
    } else
      if (TTX[cd][i].subject !== 'Free') {
        //console.log(TT[cd][i].subject);
        ender = counti;
        if (i < timing.length - 1 && TTX[cd][i].subject === TTX[cd][i + 1].subject) {
          dupstate = true;
          dups.push(counti);
        }
        nonFree.push(ender);
      }
  }
  dupstate = false;
  for (let i = 0; i < tl.length; i++) {
    if (i === 0) {
      states.push(0);
      slot += 1;
    } else
      if (dups.includes(i)) {
        states.push(4);
        if (dupstate === false) {
          dupstate = true;
        } else {
          dupstate = false;
        }
      } else
        if (nonFree.includes(i)) {
          states.push(1);
        } else
          if (i >= ender) {
            states.push(3);
          } else
            if (i % 2 === 0) {
              if (dupstate === true) {
                states.push(4);
              } else {
                states.push(2);
              }
            } else {
              states.push(2);
            }
  }
  //console.log(nonFree);
  return states;
}


function nextClass(TTX, n, cd) {
  next = -1;
  for (let i = n + 1; i < timing.length; i++) {
    if (TTX[cd][i].subject !== 'Free') {
      //console.log(i);
      next = i;
      break;
    }
  }
  return next;
}

function prevNext(st, n) {
  prev = -1;
  for (let i = 0; i < n; i++) {
    if (st[i] === 1 || st[i] === 4) {
      prev = i;
    }
  }
  return prev;
}

function getTimeDifference(h1, m1, h2, m2) {
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  const differenceInMinutes = Math.abs(minutes1 - minutes2);
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInMinutesModulo = differenceInMinutes % 60;
  return {
    hours: differenceInHours,
    minutes: differenceInMinutesModulo
  };
}


function TimeT(props): JSX.Element {
  const TT = props.TT;
  const redsubStyle = {
    backgroundColor: 'black',
    color: '#ff00ff',
    textAlign: 'center',
    fontSize: 25,
  };

  const subStyle = {
    backgroundColor: 'black',
    color: 'yellow',
    textAlign: 'center',
    fontSize: 25,
  };

  const codeStyle = {
    backgroundColor: 'black',
    color: 'lightgreen',
    textAlign: 'center',
    fontSize: 20
  };

  const roomStyle = {
    backgroundColor: 'black',
    color: 'lightgreen',
    textAlign: 'center',
    fontSize: 20
  };

  const slotStyle = {
    backgroundColor: 'black',
    color: 'lightgreen',
    textAlign: 'center',
    fontSize: 20,
  };

  const freeStyle = {
    backgroundColor: 'black',
    color: 'cyan',
    textAlign: 'center',
    fontSize: 20
  }

  const nextStyle = {
    backgroundColor: 'black',
    textAlign: 'center',
    color: '#01d5fe',
    paddingBottom: 7,
    fontSize: 18
  }

  const nextTimeStyle = {
    backgroundColor: 'black',
    textAlign: 'center',
    color: '#be6069',
    paddingBottom: 7,
    fontSize: 18
  }


  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('en-US', options);
  //const currentDay = "Friday";
  const currentTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hourCycle: 'h12' });
  //const currentHour = now.getHours();
  //const currentMinute = now.getMinutes();
  const currentHour = 14;
  const currentMinute = 41;


  var currentDay = props.currentDay;

  if (props.currentDay === 'Sunday' || props.currentDay === 'Saturday') {
    return (
      <View
        style={{
          backgroundColor: props.isDarkMode ? Colors.black : Colors.white,
        }}>
        <BasicTime currentDay={props.currentDay} />
        <Text style={freeStyle}>Its a holiday, enjoy it bro!</Text>
      </View>
    );
  }

  var nextClassState;
  var tl = timeline();
  var st = states(TT, tl, currentDay);
  var currentState;
  var i = 0;
  var nextState = false;
  var remHour, remMin, nextHour, nextMin;
  var previousState, prev;


  while (i < st.length - 1) {
    if (currentHour > tl[i][0] || (currentHour === tl[i][0] && currentMinute >= tl[i][1])) {
      if (currentHour < tl[i + 1][0] || (currentHour === tl[i + 1][0] && currentMinute < tl[i + 1][1])) {
        //console.log(i);
        if (st[i] === 0) {
          nextClassState = nextClass(TT, -1, currentDay);
          if (nextClassState !== -1) {
            nextState = true;
            nextHour = getTimeDifference(currentHour, currentMinute, timing[nextClassState][0], timing[nextClassState][1]).hours;
            nextMin = getTimeDifference(currentHour, currentMinute, timing[nextClassState][0], timing[nextClassState][1]).minutes;
          }
          return (
            <View
              style={{
                backgroundColor: props.isDarkMode ? Colors.black : Colors.white,
              }}>
              <BasicTime currentDay={currentDay} />
              <Text style={freeStyle}>Mornin! Seems you've got {st.filter(x => x == 1).length == 1 ? "NO" : ""} class today!</Text>
              <Text style={nextStyle}>
                {TT[currentDay][nextClassState].subject === 'Lunch' ?
                  (nextState ? 'You will have lunch next ' : '')
                  : (nextState ? 'Your first class is ' + TT[currentDay][nextClassState].subject + ' at room ' + TT[currentDay][nextClassState].Room : '')
                }
              </Text>
              <Text style={nextTimeStyle}>
                {nextState ? 'It will begin in ' + (nextHour > 0 ? nextHour + (nextHour === 1 ? ' Hour and ' : ' Hours and ') : '') + nextMin + (nextMin === 1 ? ' Minute from now' : ' Minutes from now') : 'You have no classes left'}
              </Text>
            </View>
          );
        } else
          if (st[i] === 1) {
            currentState = timing.indexOf([tl[i][0], tl[i][1], tl[i + 1][0], tl[i + 1][1]]);
            currentState = -1;
            for (let j = 0; j < timing.length; j++) {
              //console.log(timing[j], [tl[i][0], tl[i][1], tl[i + 1][0], tl[i + 1][1]]);
              //console.log(timing[j] === [tl[i][0], tl[i][1], tl[i + 1][0], tl[i + 1][1]]);
              if (timing[j][0] === tl[i][0] && timing[j][1] === tl[i][1] && timing[j][2] === tl[i + 1][0] && timing[j][3] === tl[i + 1][1]) {
                currentState = j;
                break;
              }
            }
            //console.log(currentState);
            nextClassState = nextClass(TT, currentState, currentDay);
            if (nextClassState !== -1) {
              nextState = true;
              nextHour = getTimeDifference(currentHour, currentMinute, timing[nextClassState][0], timing[nextClassState][1]).hours;
              nextMin = getTimeDifference(currentHour, currentMinute, timing[nextClassState][0], timing[nextClassState][1]).minutes;
            }
            remHour = getTimeDifference(currentHour, currentMinute, timing[currentState][2], timing[currentState][3]).hours;
            remMin = getTimeDifference(currentHour, currentMinute, timing[currentState][2], timing[currentState][3]).minutes;

            return (
              <View
                style={{
                  backgroundColor: props.isDarkMode ? Colors.black : Colors.white,
                }}>
                <BasicTime currentDay={currentDay} />
                <Text style={freeStyle}>{TT[currentDay][currentState].subject === 'Lunch' ? 'It is currently lunch now.' : 'Your current class is:'}</Text>
                <Text style={TT[currentDay][currentState].subject.includes("LAB") ? redsubStyle : subStyle}>{TT[currentDay][currentState].subject === 'Lunch' ? '' : TT[currentDay][currentState].subject}</Text>
                <Text style={codeStyle}>{TT[currentDay][currentState].subject === 'Lunch' ? '' : 'Code: ' + TT[currentDay][currentState].Code}</Text>
                <Text style={roomStyle}>{TT[currentDay][currentState].subject === 'Lunch' ? '' : 'Location: ' + TT[currentDay][currentState].Room}</Text>
                <Text style={slotStyle}>{TT[currentDay][currentState].subject === 'Lunch' ? '' : 'Slot: ' + TT[currentDay][currentState].Slot[0] + "/" + TT[currentDay][currentState].Slot[1]}</Text>
                <Text style={nextStyle}>
                  {(TT[currentDay][currentState].subject === 'Lunch' ? 'Lunch will end in ' : 'This class will end in ') + (remHour > 0 ? remHour + (remHour === 1 ? ' Hour and ' : ' Hours and ') : '') + (remMin) + (remMin === 1 ? ' Minute from now' : ' Minutes from now')}
                </Text>
                <Text style={nextStyle}>
                  {nextState && TT[currentDay][nextClassState].subject === 'Lunch' ?
                    (nextState ? 'You will have lunch next ' : '')
                    : (nextState ? 'Your next class is ' + TT[currentDay][nextClassState].subject + ' at room ' + TT[currentDay][nextClassState].Room : '')
                  }
                </Text>
                <Text style={nextTimeStyle}>
                  {nextState ? 'It will begin in ' + (nextHour > 0 ? nextHour + (nextHour === 1 ? ' Hour and ' : ' Hours and ') : '') + nextMin + (nextMin === 1 ? ' Minute from now' : ' Minutes from now') : 'You have no classes left'}
                </Text>
              </View>
            );
          } else
            if (st[i] === 2) {
              prev = prevNext(st, i);
              if (prev === -1) {

                nextClassState = nextClass(TT, 0, currentDay);

                if (nextClassState !== -1) {
                  nextState = true;
                  nextHour = getTimeDifference(currentHour, currentMinute, timing[nextClassState][0], timing[nextClassState][1]).hours;
                  nextMin = getTimeDifference(currentHour, currentMinute, timing[nextClassState][0], timing[nextClassState][1]).minutes;
                }

                return (
                  <View
                    style={{
                      backgroundColor: props.isDarkMode ? Colors.black : Colors.white,
                    }}>
                    <BasicTime currentDay={currentDay} />
                    <Text style={nextStyle}>
                      {nextState && TT[currentDay][nextClassState].subject === 'Lunch' ?
                        (nextState ? 'You will have lunch next ' : '')
                        : (nextState ? 'Your next class is ' + TT[currentDay][nextClassState].subject + ' at room ' + TT[currentDay][nextClassState].Room : '')
                      }
                    </Text>
                    <Text style={nextTimeStyle}>
                      {nextState ? 'It will begin in ' + (nextHour > 0 ? nextHour + (nextHour === 1 ? ' Hour and ' : ' Hours and ') : '') + nextMin + (nextMin === 1 ? ' Minute from now' : ' Minutes from now') : 'You have no classes left'}
                    </Text>
                  </View>
                );


              } else {
                previousState = -1;
                for (let j = 0; j < timing.length; j++) {
                  //console.log(timing[j], [tl[i][0], tl[i][1], tl[i + 1][0], tl[i + 1][1]]);
                  //console.log(timing[j] === [tl[i][0], tl[i][1], tl[i + 1][0], tl[i + 1][1]]);
                  if (timing[j][0] === tl[prev][0] && timing[j][1] === tl[prev][1] && timing[j][2] === tl[prev + 1][0] && timing[j][3] === tl[prev + 1][1]) {
                    previousState = j;
                    break;
                  }
                }
                nextClassState = nextClass(TT, previousState, currentDay);
                if (nextClassState !== -1) {
                  nextState = true;
                  nextHour = getTimeDifference(currentHour, currentMinute, timing[nextClassState][0], timing[nextClassState][1]).hours;
                  nextMin = getTimeDifference(currentHour, currentMinute, timing[nextClassState][0], timing[nextClassState][1]).minutes;
                }

                return (
                  <View
                    style={{
                      backgroundColor: props.isDarkMode ? Colors.black : Colors.white,
                    }}>
                    <BasicTime currentDay={currentDay} />
                    <Text style={freeStyle}>Your previous class was:</Text>
                    <Text style={TT[currentDay][previousState].subject.includes("LAB") ? redsubStyle : subStyle}>{TT[currentDay][previousState].subject}</Text>
                    <Text style={codeStyle}>Code: {TT[currentDay][previousState].Code}</Text>
                    <Text style={roomStyle}>Location: {TT[currentDay][previousState].Room}</Text>
                    <Text style={slotStyle}>Slot: {TT[currentDay][previousState].Slot}</Text>
                    <Text style={nextStyle}>
                      {nextState ? 'Your next class is ' + TT[currentDay][nextClassState].subject + ' at room ' + TT[currentDay][nextClassState].Room : ''}
                    </Text>
                    <Text style={nextTimeStyle}>
                      {nextState ? 'It will begin in ' + (nextHour > 0 ? nextHour + (nextHour === 1 ? ' Hour and ' : ' Hours and ') : '') + nextMin + (nextMin === 1 ? ' Minute from now' : ' Minutes from now') : 'You have no classes left'}
                    </Text>
                  </View>
                );
              }
            } else
              if (st[i] === 3) {
                return (
                  <View
                    style={{
                      backgroundColor: props.isDarkMode ? Colors.black : Colors.white,
                    }}>
                    <BasicTime currentDay={currentDay} />
                    <Text style={freeStyle}>You dont have any more classes at the moment.</Text>
                  </View>
                );
              } else
                if (st[i] === 4) {
                  for (let j = i + 1; j < st.length; j++) {
                    if (st[j] === 2 || st[j] === 3) {
                      var lastState = -1;
                      for (let k = 0; k < timing.length; k++) {
                        //console.log(timing[j], [tl[i][0], tl[i][1], tl[i + 1][0], tl[i + 1][1]]);
                        //console.log(timing[j] === [tl[i][0], tl[i][1], tl[i + 1][0], tl[i + 1][1]]);
                        if (timing[k][2] === tl[j][0] && timing[k][3] === tl[j][1]) {
                          lastState = k;
                          break;
                        }
                      }
                      currentState = -1;
                      for (let k = 0; k < timing.length; k++) {
                        //console.log(timing[j], [tl[i][0], tl[i][1], tl[i + 1][0], tl[i + 1][1]]);
                        //console.log(timing[j] === [tl[i][0], tl[i][1], tl[i + 1][0], tl[i + 1][1]]);
                        if ((timing[k][0] === tl[i][0] && timing[k][1] === tl[i][1]) || (timing[k][2] === tl[i][0] && timing[k][3] === tl[i][1])) {
                          currentState = k;
                          break;
                        }
                      }
                      //console.log(currentState);
                      nextClassState = nextClass(TT, lastState, currentDay);
                      if (nextClassState !== -1) {
                        nextState = true;
                        nextHour = getTimeDifference(currentHour, currentMinute, timing[nextClassState][0], timing[nextClassState][1]).hours;
                        nextMin = getTimeDifference(currentHour, currentMinute, timing[nextClassState][0], timing[nextClassState][1]).minutes;
                      }
                      remHour = getTimeDifference(currentHour, currentMinute, timing[lastState][2], timing[lastState][3]).hours;
                      remMin = getTimeDifference(currentHour, currentMinute, timing[lastState][2], timing[lastState][3]).minutes;
                      console.log(nextClassState);
                      return (
                        <View
                          style={{
                            backgroundColor: props.isDarkMode ? Colors.black : Colors.white,
                          }}>
                          <BasicTime currentDay={currentDay} />
                          <Text style={freeStyle}>{TT[currentDay][currentState].subject === 'Lunch' ? 'It is currently lunch now.' : 'Your current class is: '}</Text>
                          <Text style={TT[currentDay][currentState].subject.includes("LAB") ? redsubStyle : subStyle}>{TT[currentDay][currentState].subject === 'Lunch' ? '' : TT[currentDay][currentState].subject}</Text>
                          <Text style={codeStyle}>{TT[currentDay][currentState].subject === 'Lunch' ? '' : 'Code: ' + TT[currentDay][currentState].Code}</Text>
                          <Text style={roomStyle}>{TT[currentDay][currentState].subject === 'Lunch' ? '' : 'Location: ' + TT[currentDay][currentState].Room}</Text>
                          <Text style={slotStyle}>{TT[currentDay][currentState].subject === 'Lunch' ? '' : 'Slot: ' + TT[currentDay][currentState].Slot[0] + "/" + TT[currentDay][currentState].Slot[1]}</Text>
                          <Text style={nextStyle}>
                            {(TT[currentDay][currentState].subject === 'Lunch' ? 'Lunch will end in ' : 'This class will end in ') + (remHour > 0 ? remHour + (remHour === 1 ? ' Hour and ' : ' Hours and ') : '') + (remMin) + (remMin === 1 ? ' Minute from now' : ' Minutes from now')}
                          </Text>
                          <Text style={nextStyle}>
                            {nextState && TT[currentDay][nextClassState].subject === 'Lunch' ?
                              (nextState ? 'You will have lunch next ' : '')
                              : (nextState ? 'Your next class is ' + TT[currentDay][nextClassState].subject + ' at room ' + TT[currentDay][nextClassState].Room : '')
                            }
                          </Text>
                          <Text style={nextTimeStyle}>
                            {nextState ? 'It will begin in ' + (nextHour > 0 ? nextHour + (nextHour === 1 ? ' Hour and ' : ' Hours and ') : '') + nextMin + (nextMin === 1 ? ' Minute from now' : ' Minutes from now') : 'You have no classes left'}
                          </Text>
                        </View>
                      );
                    }
                  }
                }
        break;
      }
    }
    i += 1;
  }

  return <Text></Text>;
}

export default TimeT;
