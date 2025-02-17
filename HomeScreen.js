import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Titel from "./Titel";

export default function HomeScreen() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.178.38:8000/api', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        setData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
        }
    };
  
    useEffect(() => {
      // Initialer Datenabruf
      fetchData();
  
      // Intervall für wiederholten Datenabruf
      const intervalId = setInterval(fetchData, 10000); // 10000 ms = 10 Sekunden
  
      // Cleanup-Funktion, um das Intervall zu löschen, wenn die Komponente unmontiert wird
      return () => clearInterval(intervalId);
    }, []);

    return (
      <View style={styles.container}>
        <Titel style={styles.titel}>PlantPlant</Titel>
        <Text style={styles.dataText}>Empfangene Zahl: {data?.number ?? 'Keine Daten'}</Text>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  titel: {
    position: 'absolute',
    top: 125,
  },
});
