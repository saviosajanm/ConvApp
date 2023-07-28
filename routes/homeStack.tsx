import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../Home';
import Mod from '../Modifier';

const screens = {
  Home: {
    screen: Home,
    navigationOptions: {
      headerShown: false, // Hide the header for the TimeTable screen
    },
  },
  TimeTable: {
    screen: Mod,
    navigationOptions: {
      headerShown: false, // Hide the header for the TimeTable screen
    },
  }
}


const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
