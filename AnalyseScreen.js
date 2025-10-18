import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Button } from 'react-native';
import Titel from "./assets/Titel";
import styles from './assets/globalStyels';
import {LinearGradient, useFont, vec,} from "@shopify/react-native-skia";
import { Area, CartesianChart, Line} from "victory-native";
import Colors from './assets/colors';

const today_value_address = ("http://plantpi:8000/today/value")
const today_threshold_address = ("http://plantpi:8000/today/threshold")
const week_value_address = ("http://plantpi:8000/week/value")
const week_threshold_address = ("http://plantpi:8000/week/threshold")
//const today_value_address = ("http://localhost:8000/today/value")
//const today_threshold_address = ("http://localhost:8000/today/threshold")
//const week_value_address = ("http://localhost:8000/week/value")
//const week_threshold_address = ("http://localhost:8000/week/threshold")

const chartfont = require("./assets/fonts/Megrim-Regular.ttf");

const AnalyseScreen = () => {

    const [week, setWeek] = useState(false);
    const font = useFont(chartfont, 14);
    const labelColor = Colors.textDark;
    const lineColor = Colors.chartLines;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [valueData, setValueData] = useState([]);
    const [thresholdData, setThresholdData] = useState([]);

    const value_address = week ? week_value_address : today_value_address;
    const threshold_address = week ? week_threshold_address : today_threshold_address;

    const fetchValueData = () => fetchData(value_address, setValueData);
    const fetchThresholdData = () => fetchData(threshold_address, setThresholdData);

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
          time: !week
            ? new Date(timestamp).getHours() + new Date(timestamp).getMinutes() / 60 + new Date(timestamp).getSeconds() / 3600
            : new Date(timestamp).getDay() + new Date(timestamp).getHours() / 24 + new Date(timestamp).getMinutes() / 1440 + new Date(timestamp).getSeconds() / 86400,
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
  
    }, [week]);
  
    useFocusEffect(
        useCallback(() => {
        fetchAllData();
        }, [week])
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
      marginTop: 50,
    }}
      >
        <CartesianChart
          data={combinedData}
          xKey={"time"}
          yKeys={["value", "threshold"]}
          domain={{ x: !week ? [0, 24] : [0, 7] }}
          domainPadding={{ top: 30 }}
          axisOptions={{
            font,
            labelColor,
            lineColor,
            xAxis: {
              tickValues: Array.from({ length: !week ? 25 : 8 }, (_, i) => i), // 0..24 or 0..7
              labelFormatter: (v) => (!week ? `${v}h` : `Tag ${v}`),
              tickCount: !week ? 25 : 8,
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
      <View style={{top: 40, justifyContent: 'space-around', width: '60%'}}>
        <Button 
        title='Refresh' 
        onPress={fetchAllData} 
        color={Colors.green} 
        />
        <Button
          title={week ? "Zeige den Tag" : "Zeige die Woche"}
          onPress={() => setWeek(prev => !prev)}
          color={Colors.dark}
        />
      </View>
    </View>
  );
};

export default AnalyseScreen;