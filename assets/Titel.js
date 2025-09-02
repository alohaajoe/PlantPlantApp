import { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import Colors from './colors';

export default function CustomText({ children, style }) {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
      const loadFonts = async () => {
        await Font.loadAsync({
          'Megrim': require('./fonts/Megrim-Regular.ttf'),
        });
        setFontsLoaded(true);
      };
      loadFonts();
    }, []);
  
    if (!fontsLoaded) {
      return null;
    }
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Megrim',
    fontSize: 48, 
    color: Colors.textDark,
  },
});
