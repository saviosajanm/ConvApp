import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import TT from './TT.json';
import TableView from './TableView'
import { Navigation } from '@react-navigation/native';

import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import TimeTable from './TimeTable.tsx';
import TimeT from './TimeT.tsx';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Modifier from './Modifier';


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function Home({ navigation }): JSX.Element {

  const isDarkMode = useColorScheme() === 'dark';
  const now = new Date();
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const currentDay = days[now.getDay()];
  const backgroundStyle = {
    backgroundColor: 'black',
    height: '100%',
  };
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 100);
  }, []);

  const pressHandler = () => {
    navigation.navigate("TimeTable");
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

  const setCommandExecutedFlag = async () => {
    try {
      await AsyncStorage.setItem('commandExecuted', 'true');
    } catch (error) {
      console.log('Error storing flag:', error);
    }
  };

  useEffect(() => {
    const checkAndRunCommand = async () => {
      try {
        const commandExecuted = await AsyncStorage.getItem('commandExecuted');
        if (!commandExecuted) {
          storeData(TT);
          setCommandExecutedFlag();
        } else {
          console.log('Command already executed.');
        }
      } catch (error) {
        console.log('Error checking command:', error);
      }
    };

    checkAndRunCommand();
  }, []);


  //storeData(TT);
  //let TTX = null;
  const [timeTData, setTimeTData] = useState(null);

  useEffect(() => {
    getData().then((data) => {
      if (data !== null) {
        // Data fetched successfully, update the state
        //console.log(data);

        setTimeTData(data);
      } else {
        console.log('No data found for the key.');
      }
    });
  }, []);

  //console.log("---------------------------------", timeTData);
  //console.log("---------------------------------", TT);
  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView style={mainStyle} contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

        {timeTData ? (
          // Render the <TimeT> component with the fetched data
          <View>
            <TimeT isDarkMode={isDarkMode} currentDay={currentDay} TT={timeTData} />
            <TableView currentDay={currentDay} TT={timeTData}/>
          </View>

        ) : (
          // Render loading indicator or other content while waiting for data
          <ActivityIndicator size="large" color="#0000ff" />
        )}

      </ScrollView>
      <View>
        <Pressable style={styles.button} onPress={pressHandler}>
          <Text style={styles.buttonText}>{"Edit Timetable"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

//<TableView currentDay={"Thursday"} TT={timeTData}/>

const mainStyle = {
  margin: '5%',
};

const windowWidth = Dimensions.get('window').width * 9 / 10;

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    backgroundColor: 'black'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    backgroundColor: 'black'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    backgroundColor: 'black'
  },
  highlight: {
    fontWeight: '700',
    backgroundColor: 'black'
  },
  button: {
    borderWidth: 2,
    borderColor: 'limegreen',
    //backgroundColor: 'limegreen',
    borderRadius: 75,
    width: windowWidth,
    height: 35,
    overflow: 'hidden',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonText: {
    textAlign: 'center',
    color: 'limegreen',
    fontSize: 20,
  },
});

export default Home;
