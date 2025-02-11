import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';
import HomeScreen from './HomeScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeout = 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingTimeout); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff'}}>
      {isLoading ? <LoadingScreen /> : <HomeScreen />}
      <StatusBar style="auto" />
    </View>
  );
}
