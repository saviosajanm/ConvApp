import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
//import TT from './TT.json';
import BasicTime from './BasicTimeDay.tsx';
import { DropDownPicker } from 'react-native-dropdown-picker';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
//import RNFS from 'react-native-fs';
import fs from 'fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
const filePath = './TT.json';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Dimensions,
  View,
  Animated,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function Mod({ navigation }, props): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [slotNum, setSlotNum] = React.useState('1');

  function addSlotArray(item) {

  }

  const [sub, setSub] = React.useState('Free');
  const onSubChange = (itemValue) => {
    if (itemValue === '') {
      setSub('Free');
    } else {
      setSub(itemValue);
    }
  };
  const [code, setCode] = React.useState('Nothing');
  const onCodeChange = (itemValue) => {
    if (itemValue === '') {
      setCode('Nothing');
    } else {
      setCode(itemValue);
    }
  };
  const [room, setRoom] = React.useState('Anywhere');
  const onRoomChange = (itemValue) => {
    if (itemValue === '') {
      setRoom('Anywhere');
    } else {
      setRoom(itemValue);
    }
  };

  const [number, onChangeNumber] = React.useState('');

  const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      color: 'white',
      fontSize: 18
    },
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.black : Colors.lighter,
    height: '100%',
  };

  const slotL = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'TA', 'TB', 'TC', 'TD', 'TE', 'TF', 'TG', 'TAA', 'TBB', 'TCC', 'TDD', 'L', '-'];

  const [selectedSlot, setSelectedSlot] = useState('A');
  const [falseSlot, setFalseSlot] = useState(false);

  const onValueChange = (itemValue, itemIndex) => {
    setSelectedSlot(itemValue);
    if (itemValue == "-") {
      setSlotNum("")
    }
  };

  const [modded, setModded] = useState(false);
  const onMod = () => {
    setModded(true);
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('ttx', jsonValue);
    } catch (e) {
      console.log(e);

    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('ttx');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };


  //storeData(TT);



  const pressHandler = () => {
    interface ClassInfo {
      subject: string;
      Code: string;
      Room: string;
      Slot: string;
    }

    type ClassSchedule = (ClassInfo | number[])[];

    interface Schedule {
      [day: string]: ClassSchedule;
    }

    // Function to update the class information for a specific slot
    function updateClassInfo(classInfo: ClassInfo, newSubject: string, newCode: string, newRoom: string): ClassInfo {
      return {
        ...classInfo,
        subject: newSubject,
        Code: newCode,
        Room: newRoom,
      };
    }

    // Function to update the schedule and the 13-element array
    function updateSchedule(TT: Schedule, targetSlot: string, newSubject: string, newCode: string, newRoom: string): Schedule {
      setFalseSlot(true);
      const updatedSchedule: Schedule = {};
      //console.log(targetSlot);

      for (const day in TT) {
        if (Object.prototype.hasOwnProperty.call(TT, day)) {
          const classSchedule = TT[day];
          if (targetSlot.includes("-")) {
            targetSlot = "-";
          }
          const updatedClassSchedule: ClassSchedule = classSchedule.map((classItem) => {
            if (classItem.Slot.includes(targetSlot)) {
              setFalseSlot(false);
              return updateClassInfo(classItem, newSubject, newCode, newRoom);
            } else {
              setFalseSlot(true);
              return classItem;
            }
          });
          updatedSchedule[day] = updatedClassSchedule;
        }
      }
      storeData(updatedSchedule);
      //console.log(updatedSchedule);

      //return updatedSchedule;
    }

    // Example usage:
    getData().then((data) => {
      if (data !== null) {
        const TT = data;
        updateSchedule(TT, selectedSlot + slotNum, sub, code, room);
        //console.log(updatedTT);

        onMod();
      } else {
        console.log('No data found for the key.');
      }
    });
  }

  const pressHandlerHome = () => {
    navigation.navigate("Home");
  }

  const pagestyles = StyleSheet.create({
    viewer: {
      padding: 5,
      marginTop: 5,
      marginBottom: 5,
    },
    form: {
      color: 'yellow',
      fontSize: 18
    },
    finale: {
      color: 'lightblue',
      fontSize: 18
    },
    modded: {
      color: 'limegreen',
      fontSize: 18,
      textAlign: 'center'
    },
    wrong: {
      color: 'red',
      fontSize: 18,
      textAlign: 'center'
    },
    buttonSpacer: {
      marginBottom: -13
    },
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView>
        <View style={pagestyles.viewer}>
          <Text style={pagestyles.form}>{"Enter Subject Name (Add \'(LAB)\' at the end if it is a lab class)"}:</Text>
          <TextInput
            style={styles.input}
            onChangeText={onSubChange}
            placeholder={"Ignore if there is no subject"}
          />
          <Text style={pagestyles.form}>Enter Subject Code:</Text>
          <TextInput
            style={styles.input}
            onChangeText={onCodeChange}
            placeholder={"Ignore if there is no subject"}
          />
          <Text style={pagestyles.form}>Select Subject Room:</Text>
          <TextInput
            style={styles.input}
            onChangeText={onRoomChange}
            placeholder={"Ignore if there is no subject"}
          />
          <Text style={pagestyles.form}>Select Slot:</Text>
          <Picker
            selectedValue={selectedSlot}
            onValueChange={onValueChange}
          >
            {slotL.map((slot, index) => (
              <Picker.Item key={index} label={slot} value={slot} />
            ))}
          </Picker>
          <Text style={pagestyles.form}>Enter Slot number:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setSlotNum}
            placeholder={"Ex. enter 2 if slot is A2..."}
          />
        </View>



      </ScrollView>
      <View style={pagestyles.viewer}>
        <Text style={pagestyles.finale}>Subject: {sub}</Text>
        <Text style={pagestyles.finale}>Subject Code: {code}</Text>
        <Text style={pagestyles.finale}>Subject Location: {room}</Text>
        <Text style={pagestyles.finale}>Selected Slot: {selectedSlot}{slotNum}</Text>
      </View>
      {modded ?
        (falseSlot ?
          (<Text style={pagestyles.modded}>{"Slot has bee modified! You can reload the app to reflect changes..."}</Text>) :
          (<Text style={pagestyles.wrong}>{"INVALID SLOT!"}</Text>)
        ) : (<Text></Text>)}
      <Text style={pagestyles.buttonSpacer}></Text>
      <Button title="Modify Slot" onPress={pressHandler} />
      <Text style={pagestyles.buttonSpacer}></Text>
      <Button title="Back to Home" onPress={pressHandlerHome} />
    </SafeAreaView>
  );
}

export default Mod;
