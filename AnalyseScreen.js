import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import Titel from "./assets/Titel";
import styles from './assets/globalStyels';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryAxis, VictoryTheme } from 'victory-native';

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


  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.getHours() + d.getMinutes() / 60;
  };
  
  const toXY = (arr) =>
  [...arr]
    .filter(p => p.time && typeof p.value === 'number')
    .sort((a, b) => new Date(a.time) - new Date(b.time))
    .map(p => ({ x: formatTime(p.time), y: p.value }));


  return (
    <View style={styles.container}>
      <Titel style={styles.titel}>Historie</Titel>
        <VictoryChart
          theme={VictoryTheme.material}
          domain={{ x: [0, 24], y: [0, 100] }} // Feste Y-Achsen-Grenzen
        >
          <VictoryAxis
            tickValues={[0, 6, 12, 18, 24]}
            tickFormat={(t) => `${t}h`}
          />
          <VictoryAxis dependentAxis />
          {/* Serie 1 */}
          <VictoryLine
            data={toXY(value)}
            interpolation="monotoneX"
            style={{ data: { stroke: '#4A90E2' } }}
          />
          <VictoryScatter
            data={toXY(value)}
            size={3}
            style={{ data: { fill: '#4A90E2' } }}
          />

          {/* Serie 2 */}
          <VictoryLine
            data={toXY(threshold)}
            interpolation="monotoneX"
            style={{ data: { stroke: '#E94E77' } }}
          />
          <VictoryScatter
            data={toXY(threshold)}
            size={3}
            style={{ data: { fill: '#E94E77' } }}
          />
        </VictoryChart>
    </View>
  );
};

export default AnalyseScreen;