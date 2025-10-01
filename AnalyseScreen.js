import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import Titel from "./assets/Titel";
import styles from './assets/globalStyels';


//const today_value_address = ("http://plantpi:8000/today/value")
//const today_threshold_address = ("http://plantpi:8000/today/threshold")
const today_value_address = ("http://localhost:8000/today/value")
const today_threshold_address = ("http://localhost:8000/today/threshold")

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
          time: timestamp.split("T")[1].split(".")[0]
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


  return (
    <View style={styles.container}>
      <Titel style={styles.titel}>Historie</Titel>

    </View>
  );
};

export default AnalyseScreen;