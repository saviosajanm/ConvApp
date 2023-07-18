/* eslint-disable prettier/prettier */
import React from 'react';
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
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

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

function checkNext(cd, cs = -1) {
    var next = -1;
    for(let j = (cs + 1); j < TT.Timing.length; j++) {
        if(TT[cd][j].subject !== 'Free') {
            next = j;
            //console.log(next);
            break;
        }
    }

    return next;
}

function checkLast(cd) {
    var next = -1;
    for(let j = 0; j < TT.Timing.length; j++) {
        if(TT[cd][j].subject !== 'Free') {
            next = j;
        }
    }

    return next;
}


function TimeTable(props): JSX.Element {
    console.log("++++++++++++++++++++++++++++++++++++++++++++=");
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-US', options);

    //const currentDay = days[now.getDay()];
    const currentDay = "Wednesday";
    const currentTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hourCycle: 'h12' });
    //const currentHour = now.getHours();
    const currentHour = props.hour;
    const currentMinute = props.min;
    //const currentMinute = now.getMinutes();

    var inClass = false;
    var classState = -1;
    var nextClassState = -1;
    var after = 0;
    var holidayState = false;
    var prevState = false;
    var nextState = false;
    var classOcc = false;
    var withinSlot = false;
    var withinGap = false;
    var afterOver = false;
    var history = [];

    var lastHour = TT.Timing[checkLast(currentDay)][2];
    var lastMinute = TT.Timing[checkLast(currentDay)][3];
    if(currentDay === 'Saturday' || currentDay === 'Sunday') {
        holidayState = true;
    } else
    if(currentHour < 8) {
        prevState = true;
        nextClassState = checkNext(currentDay);
        if(nextClassState === -1) {
            nextState = false;
        } else {
            nextState = true;
        }
        console.log(nextClassState, nextState);
    } else
    if(currentHour > lastHour || (currentMinute > lastMinute && currentHour === lastHour)) {
        nextState = false;
        afterOver = true;
    } else {
        for(let i = 0; i < TT.Timing.length; i++) {
            history.push(i);
            for(let j = history.length - 1; j > -1; j--) {
                //console.log("balh");
                if(TT[currentDay][history[j]].subject !== 'Free') {
                    after = history[j] - 1;
                    break;
                }
            }
            //after = history[history.length - 1] - 1;
            if(i > 0 && (currentHour < TT.Timing[i][0] || (currentHour === TT.Timing[i][0] && currentMinute < TT.Timing[i][1]))) {
                if(currentHour > TT.Timing[i - 1][2] || (currentHour === TT.Timing[i - 1][2] && currentMinute >= TT.Timing[i - 1][3])) {
                    withinGap = true;
                    console.log(i);
                    break;
                }
            }
            //console.log("hi");
            if (currentHour > TT.Timing[i][0] || (currentHour === TT.Timing[i][0] && currentMinute >= TT.Timing[i][1])) {
                if (currentHour < TT.Timing[i][2] || (currentHour === TT.Timing[i][2] && currentMinute < TT.Timing[i][3])) {
                    classState = i;
                    if(TT[currentDay][classState].subject === 'Free') {
                        inClass = false;
                        withinSlot = true;
                    } else {
                        inClass = true;
                    }
                    if(classState < TT.Timing.length - 1) {
                        nextClassState = checkNext(currentDay, classState);
                        if(nextClassState === -1) {
                            nextState = false;
                        } else {
                            nextState = true;
                        }
                    }
                    break;
                } else {
                    //console.log('Current time is outside the defined time period.');
                }
            } else {
                //console.log('Current time is outside the defined time period.');
            }
        }
    }
    console.log(history);
    if(classState === -1 && holidayState === false && prevState === false) {
        nextClassState = checkNext(currentDay, after);
        if(nextClassState === -1) {
            nextState = false;
        } else {
            nextState = true;
        }
    }
    var remHour = 0;
    var remMin = 0;
    if(nextState) {
        var remTime = getTimeDifference(currentHour, currentMinute, TT.Timing[nextClassState][0], TT.Timing[nextClassState][1]);
        remHour = remTime.hours;
        remMin = remTime.minutes;
    }

    if(holidayState) {
        return (
            <View
                style={{
                    backgroundColor: props.isDarkMode ? Colors.black : Colors.white,
                }}>
                <Text style={dateStyle}>{currentDate}</Text>
                <Text style={dayStyle}>{currentDay}</Text>
                <Text style={timeStyle}>{currentTime}</Text>
                <Text style={freeStyle}>Its a holiday, enjoy it bro!</Text>
            </View>
        );
    } else
    if (prevState) {
        //console.log(nextClassState);
        return (
            <View
                style={{
                    backgroundColor: props.isDarkMode ? Colors.black : Colors.white,
                }}>
                <Text style={dateStyle}>{currentDate}</Text>
                <Text style={dayStyle}>{currentDay}</Text>
                <Text style={timeStyle}>{currentTime}</Text>
                <Text style={freeStyle}>Mornin! Seems you've got class today!</Text>
                <Text style={nextStyle}>
                    {nextState ? 'Your first class is ' + TT[currentDay][nextClassState].subject + ' at room ' + TT[currentDay][nextClassState].Room: ''}
                </Text>
                <Text style={nextStyle}>
                    {nextState ? 'It will begin in ' + (remHour > 0 ? remHour + (remHour === 1 ? ' Hour and ' : ' Hours and ') : '') + remMin + (remMin === 1 ? ' Minute from now' : ' Minutes from now'): 'You have no classes left'}
                </Text>
            </View>
        );
    } else
    if (inClass === true) {
        var periodhour = getTimeDifference(currentHour, currentMinute, TT.Timing[classState][2], TT.Timing[classState][3]).hour;
        var periodMin = getTimeDifference(currentHour, currentMinute, TT.Timing[classState][2], TT.Timing[classState][3]).minutes;
        return (
            <View
                style={{
                    backgroundColor: props.isDarkMode ? Colors.black : Colors.white,
                }}>
                <Text style={dateStyle}>{currentDate}</Text>
                <Text style={dayStyle}>{currentDay}</Text>
                <Text style={timeStyle}>{currentTime}</Text>
                <Text style={freeStyle}>Your current class is:</Text>
                <Text style={subStyle}>{TT[currentDay][classState].subject}</Text>
                <Text style={codeStyle}>Code: {TT[currentDay][classState].Code}</Text>
                <Text style={roomStyle}>Location: {TT[currentDay][classState].Room}</Text>
                <Text style={slotStyle}>Slot: {TT[currentDay][classState].Slot}</Text>
                <Text style={nextStyle}>
                    {nextState ? 'This class will end in ' + (periodhour > 0 ? periodhour + (periodhour === 1 ? ' Hour and ' : ' Hours and ') : '') + (periodMin) + (periodMin === 1 ? ' Minute from now' : ' Minutes from now'): 'You have no classes left'}
                </Text>
                <Text style={nextStyle}>
                    {nextState ? 'Your next class is ' + TT[currentDay][nextClassState].subject + ' at room ' + TT[currentDay][nextClassState].Room: ''}
                </Text>
                <Text style={nextStyle}>
                    {nextState ? 'It will begin in ' + (remHour > 0 ? remHour + (remHour === 1 ? ' Hour and ' : ' Hours and ') : '') + remMin + (remMin === 1 ? ' Minute from now' : ' Minutes from now'): 'You have no classes left'}
                </Text>
            </View>
        );
    } else
    if ((classState === -1 && holidayState === false && prevState === false) || withinSlot) {
        return (
            <View
                style={{
                    backgroundColor: props.isDarkMode ? Colors.black : Colors.white,
                }}>
                <Text style={dateStyle}>{currentDate}</Text>
                <Text style={dayStyle}>{currentDay}</Text>
                <Text style={timeStyle}>{currentTime}</Text>
                <Text style={freeStyle}>Your previous class was:</Text>
                <Text style={subStyle}>{TT[currentDay][after].subject}</Text>
                <Text style={codeStyle}>Code: {TT[currentDay][after].Code}</Text>
                <Text style={roomStyle}>Location: {TT[currentDay][after].Room}</Text>
                <Text style={slotStyle}>Slot: {TT[currentDay][after].Slot}</Text>
                <Text style={nextStyle}>
                    {nextState ? 'Your next class is ' + TT[currentDay][nextClassState].subject + ' at room ' + TT[currentDay][nextClassState].Room: ''}
                </Text>
                <Text style={nextStyle}>
                    {nextState ? 'It will begin in ' + (remHour > 0 ? remHour + (remHour === 1 ? ' Hour and ' : ' Hours and ') : '') + remMin + (remMin === 1 ? ' Minute from now' : ' Minutes from now'): 'You have no classes left'}
                </Text>
            </View>
        );
    } else {
        return (
            <View
                style={{
                    backgroundColor: props.isDarkMode ? Colors.black : Colors.white,
                }}>
                <Text style={dateStyle}>{currentDate}</Text>
                <Text style={dayStyle}>{currentDay}</Text>
                <Text style={timeStyle}>{currentTime}</Text>
                <Text style={freeStyle}>You dont have any more classes at the moment.</Text>
            </View>
        );
    }
}

const dateStyle = {
    color: 'cyan',
    fontSize: 30,
};

const subStyle = {
    backgroundColor: 'darkblue',
};

const codeStyle = {
    backgroundColor: 'darkblue',
};

const roomStyle = {
    backgroundColor: 'darkblue',
};

const slotStyle = {
    backgroundColor: 'darkblue',
};

const timeStyle = {
    backgroundColor: 'darkblue',
};

const dayStyle = {
    backgroundColor: 'darkblue',
};

const freeStyle = {
    backgroundColor: 'darkblue',
}

const nextStyle = {
    backgroundColor: 'darkblue',
}


export default TimeTable;
