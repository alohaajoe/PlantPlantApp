import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import Titel from "./assets/Titel";
import styles from './assets/globalStyels';
import {LinearGradient, useFont, vec,} from "@shopify/react-native-skia";
import { Area, CartesianChart, Line} from "victory-native";
import Colors from './assets/colors';

//const today_value_address = ("http://plantpi:8000/today/value")
//const today_threshold_address = ("http://plantpi:8000/today/threshold")
const today_value_address = ("http://localhost:8000/today/value")
const today_threshold_address = ("http://localhost:8000/today/threshold")

const chartfont = require("./assets/fonts/Megrim-Regular.ttf");

const AnalyseScreen = () => {

    const font = useFont(chartfont, 14);
    const labelColor = Colors.textDark;
    const lineColor = Colors.chartLines;

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

    const combinedData = valueData.map((v, i) => ({
      time: v.time,
      value: v.value,
      threshold: thresholdData[i]?.value ?? null,
    }));

  
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
      backgroundColor: Colors.background, 
      borderRadius: 12,
      shadowColor: Colors.dark,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3, // für Android
      marginTop: 20,
    }}
      >
        <CartesianChart
          data={combinedData}
          xKey={"time"}
          yKeys={["value", "threshold"]}
          domain={{ x: [0, 24] }}
          domainPadding={{ top: 30 }}
          axisOptions={{
            font,
            labelColor,
            lineColor,
            xAxis: {
              tickValues: Array.from({ length: 25 }, (_, i) => i), // 0..24
              labelFormatter: (v) => `${v}h`,
              tickCount: 25,
            },
          }}
        >
          {({ points, chartBounds }) => {
            return (
              <>
                <Line
                  points={points.value}
                  color={Colors.green}
                  strokeWidth={2}
                  animate={{ type: "timing", duration: 500 }}
                />
                <Area
                  points={points.value}
                  y0={chartBounds.bottom}
                  animate={{ type: "timing", duration: 500 }}
                >
                  <LinearGradient
                    start={vec(chartBounds.bottom, 200)}
                    end={vec(chartBounds.bottom, chartBounds.bottom)}
                    colors={[Colors.green + "80", Colors.green + "00"]}
                  />
                </Area>
              
                <Line
                  points={points.threshold}
                  color={Colors.dark}
                  strokeWidth={2}
                  animate={{ type: "timing", duration: 500 }}
                />
              </>
            );
          }}
        </CartesianChart>
      </View>
    </View>
  );
};

export default AnalyseScreen;