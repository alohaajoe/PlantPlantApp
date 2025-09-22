import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import Titel from "./assets/Titel";
import styles from './assets/globalStyels';
import { LineChart } from "react-native-gifted-charts";

const today_value_address = ("http://plantpi:8000/today/value")
const today_threshold_address = ("http://plantpi:8000/today/threshold")

const AnalyseScreen = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [value, setValue] = useState([]);
    const [threshold, setThreshold] = useState([]);
    const fetchValueData = () => fetchData(today_value_address, setValue);
    const fetchThresholdData = () => fetchData(today_threshold_address, setThreshold);

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
          time: timestamp
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

  // Feste X-Achsen-Beschriftung (0h–24h)
  const xAxisLabelTexts = ['0h', '6h', '12h', '18h', '24h'];


  const formatTime = (iso) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };
  
  const toChartData = (arr) =>
  arr.map((p) => ({
    value: p.value,
  }));


  return (
    <View style={styles.container}>
      <Titel style={styles.titel}>Historie</Titel>
        <LineChart 
          areaChart
          curved
          maxValue={100} // Y-Achse bleibt 0 - 100
          yAxisLabelWidth={30}
          yAxisTextStyle={{ fontSize: 12 }}
          xAxisLabelTextStyle={{ fontSize: 12 }}
          data={toChartData(value)}
          data2={toChartData(threshold)}
          color1="#4A90E2"
          color2="#E94E77"
          // Zeitachse fix von 0 bis 24
          xAxisLabelTexts={xAxisLabelTexts}
        />
    </View>
  );
};

export default AnalyseScreen;