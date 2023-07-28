import React, { useState, useEffect, useRef } from 'react';
import type { PropsWithChildren } from 'react';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  Dimensions,
  View,
  Animated,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


function TableView(props): JSX.Element {

  function getTable() {
    let columns = [];
    const TT = props.TT;
    //console.log("-----------", TT);
    for(const day in TT) {
      ddx = [];
      ddx.push(day);
      for(let slot = 0; slot < TT[day].length; slot++) {
        //console.log(TT[day][slot], "-------------------");
        if(TT[day][slot].subject === "Free") {
          ddx.push(TT[day][slot].Slot[0] + "/" + TT[day][slot].Slot[1]);
        } else
        if(TT[day][slot].subject === "Lunch"){
          ddx.push("Lunch");
        } else {
          ddx.push((TT[day][slot].subject) + "\n" + (TT[day][slot].Code) + "\n" + (TT[day][slot].Room) + "\n" + (TT[day][slot].Slot[0] + "/" + TT[day][slot].Slot[1]));
        }
      }
      columns.push(ddx);
    }
    const numRows = columns.length;
    const numCols = columns[0].length;
    const rotatedTable: T[][] = Array.from({ length: numCols }, () => []);
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        rotatedTable[col][row] = columns[row][col];
      }
    }
    return rotatedTable;
  }

  const windowWidth = Dimensions.get('window').width * 9 / 10;
  //console.log("++++++++++++++++++++++", windowWidth);

  const styles = StyleSheet.create({
  staticCell: {
    height: 50,
    borderWidth: 1,
    borderColor: '#3F66DA',
    justifyContent: 'center',
    alignItems: 'center',
    height: 95,
  },
  staticText: {
    color: '#3F66DA',
  },
  container: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#f0f0f0',
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#282c34',
    padding: 10,
    width: windowWidth - 80,
    height: 95,
    alignItems: 'center',
  },
  headerCell: {
    borderColor: 'yellow',
    backgroundColor: 'black',
    height: 50,
  },
  lunchCell: {
    borderColor: 'limegreen',
    height: 50,
  },
  cellText: {
    textAlign: 'center',
    color: 'white',
  },
  headText: {
    textAlign: 'center',
    color: 'yellow',
    fontSize: 20,
  },
  lunchText: {
    textAlign: 'center',
    color: 'limegreen',
    fontSize: 20,
  },
  subCell: {
    borderColor: 'cyan',
  },
  subText: {
    textAlign: 'center',
    color: 'cyan',
  },
  scroll: {
    marginTop: 20,
  },
  staticColumn: {
    marginRight: 0,
    marginTop: 20,
    width: 80,
  },
  lunchTime: {
    textAlign: 'center',
    color: 'limegreen',
  },
  redCell: {
    borderColor: 'red',
    height: 95,
  },
  redText: {
    textAlign: 'center',
    color: 'red',
  },
});

  const tab = getTable();
  //console.log(tab);

  var timing = [
    "Timings",
    "8:00 AM - 8:50 AM",
    "8:55 AM - 9:45 AM",
    "9:50 AM - 10:40 AM",
    "10:45 AM - 11:35 AM",
    "11:40 AM - 12:30 PM",
    "12:35 PM - 1:25 PM",
    "1:30 PM - 1:55 PM",
    "2:00 PM - 2:50 PM",
    "2:55 PM - 3:45 PM",
    "3:50 PM - 4:40 PM",
    "4:45 PM - 5:35 PM",
    "5:40 PM - 6:30 PM",
    "6:35 PM - 7:25 PM"
  ]

  var timingNum = [
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

  const isTimeBetweenIntervals = () => {
    const currentHour = (new Date()).getHours();
    const currentMinute = (new Date()).getMinutes();
    //const currentHour = 12;
    //const currentMinute = 47;

    //console.log(currentHour, currentMinute, "-------------------------");

    for (let i = 1; i < timingNum.length; i++) {
      const [startHour, startMinute, endHour, endMinute] = timingNum[i];
      //console.log(i);

      //s = timing[i].split('-')
      //const [startHour, startMinute] = [s[0].slice(0, -3).split(":")[0], s[0].slice(0, -3).split(":")[1]].map(Number);
      //const [endHour, endMinute] = [s[1].slice(0, -3).split(":")[0], s[1].slice(0, -3).split(":")[1]].map(Number);
      //console.log([startHour, startMinute, endHour, endMinute]);

      //console.log(s[0].slice(0, -3));
      if(i - 1 >= 0){
        //sx = timing[i].split('-')
        //const [startHourx, startMinutex] = [sx[0].slice(0, -3).split(":")[0], sx[0].slice(0, -3).split(":")[1]].map(Number);
        const [startHourx, startMinutex, endHourx, endMinutex] = timingNum[i - 1];
        if(currentHour > endHourx || (currentHour === endHourx && currentMinute >= endMinutex)) {
          if(currentHour < startHour || (currentHour === startHour && currentMinute < startMinute)) {
            return i + 1;
          }
        }
      }
      if (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) {
        if (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
          return i + 1;
        }
      }
    }
    return -1;
  };

  const atslot = isTimeBetweenIntervals();
  //console.log(atslot);

  const scrollRef = useRef(null);
  const initialOffset = (tab[0].indexOf(props.currentDay)) * (windowWidth - 80);

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: initialOffset, y: 0, animated: false });
  }, []);

  const scrollToPosition = (position) => {
    if (scrollRef.current) {
      const xPosition = position * (windowWidth - 80);
      scrollRef.current.scrollTo({ x: xPosition, animated: false });
    }
  };

  const StaticTable = () => {
    return (
      <View style={styles.staticColumn}>
        {timing.map((cell, index) => (
          <View key={index} style={[
            styles.staticCell,
            cell.includes("1:30 PM") ? styles.lunchCell : null,
            index === 0 ? styles.headerCell : null,
            index === atslot ? styles.redCell : null,
          ]}>
            <Text style={[
              styles.staticText,
              cell.includes("1:30 PM") ? styles.lunchTime : null,
              index === 0 ? styles.headText : null,
              index === atslot ? styles.redText : null,
            ]}>{cell}</Text>
          </View>
        ))}
      </View>
    );
  };

  const ScrollableTable = () => {

    //console.tab[0].indexOf(props.currentDay));

    //scrollToPosition(tab[0].indexOf(props.currentDay));

    return (
      <ScrollView horizontal style={styles.scroll} ref={scrollRef} pagingEnabled>
        <FlatList
          data={tab}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.row, index === 0 ? styles.headerRow : null]}>
              {item.map((cell, cellIndex) => (
                <View
                  key={cellIndex}
                  style={[
                    styles.cell,
                    cell === 'Lunch' ? styles.lunchCell : null,
                    index === 0 ? styles.headerCell : null,
                    cell.length > 10 ? styles.subCell : null,
                    index === atslot ? styles.redCell: null,
                  ]}
                >
                  <Text style={[
                    styles.cellText,
                    cell === 'Lunch' ? styles.lunchText : null,
                    index === 0 ? styles.headText : null,
                    cell.length > 10 ? styles.subText : null,
                    index === atslot ? styles.redText : null,
                  ]}>{cell}</Text>
                </View>
              ))}
            </View>
          )}
        />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StaticTable />
      <ScrollableTable />
    </View>
  );

}

export default TableView;
