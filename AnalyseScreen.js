import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import Titel from "./assets/Titel";
import styles from './assets/globalStyels';
import { Circle, LinearGradient, useFont, vec,} from "@shopify/react-native-skia";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";
import { Area, CartesianChart, Line, useChartPressState } from "victory-native";

import { Text as SKText } from "@shopify/react-native-skia";


//const today_value_address = ("http://plantpi:8000/today/value")
//const today_threshold_address = ("http://plantpi:8000/today/threshold")
const today_value_address = ("http://localhost:8000/today/value")
const today_threshold_address = ("http://localhost:8000/today/threshold")

const AnalyseScreen = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [valueData, setValueData] = useState([]);
    const [thresholdData, setThresholdData] = useState([]);
    const fetchValueData = () => fetchData(today_value_address, setValueData);
    const fetchThresholdData = () => fetchData(today_threshold_address, setThresholdData);

    const fetchData = async (url, setter) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const received = await response.json();
        //console.log('Fetched data:', received);

        // Nur Value und Zeit extrahieren
        const items = (received.messages ?? []).map(({ value, timestamp }) => ({
          value,
          time: new Date(timestamp).getHours() + new Date(timestamp).getMinutes() / 60 + new Date(timestamp).getSeconds() / 3600, 
        }));

        setter(items);
        console.log('Processed items:', items);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllData = () => {
      fetchValueData();
      fetchThresholdData();
    };
  
    useEffect(() => {
      // Intervall für wiederholten Datenabruf
      const queryInterval = setInterval(() => {
        fetchAllData();
      }, (60000 * 30));
  
      // Cleanup-Funktion, um das Intervall zu löschen, wenn die Komponente unmontiert wird
      return () => clearInterval(queryInterval);
  
    }, []);
  
    useFocusEffect(
        useCallback(() => {
        fetchAllData();
        }, [])
    );


  return (
    <View style={styles.container}>
      <Titel style={styles.titel}>Historie</Titel>
      <View 
    style={{
      width: "90%", 
      height: 300, 
      padding: 16, 
      backgroundColor: "white", 
      borderRadius: 12,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3, // für Android
      marginTop: 20,
    }}
      >
        <CartesianChart
          data={valueData}
          xKey={"time"}
          yKeys={["value"]}
          domainPadding={{ top: 30 }}
        >
          {({ points }) => (
            <Line
              points={points.value}
              color={"black"}
              strokeWidth={3}
              animate={{ type: "timing", duration: 2000 }}
            />
          )}
        </CartesianChart>
      </View>
    </View>
  );
};

export default AnalyseScreen;