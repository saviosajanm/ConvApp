import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../Home';
import Mod from '../Modifier';

const screens = {
  Home: {
    screen: Home
  },
  TimeTable: {
    screen: Mod
  }
}


const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
