import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';
import HomeScreen from './HomeScreen';
import AnalyseScreen from './AnalyseScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Colors from './assets/colors';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeout = 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingTimeout); 

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <LoadingScreen />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Analyse" component={AnalyseScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const screenOptions = StyleSheet.create({
  headerShown: false,
  animation: 'shift',
  tabBarStyle: {
    backgroundColor: Colors.backgroundNavigation,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tabBarInactiveTintColor: Colors.white,
  tabBarActiveTintColor: Colors.green,
});
