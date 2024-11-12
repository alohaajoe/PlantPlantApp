import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';

export default function App() {
  /*const [data, setData] = useState(null);

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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Initialer Datenabruf
    // fetchData();

    // Intervall für wiederholten Datenabruf
    //const intervalId = setInterval(fetchData, 10000); // 10000 ms = 10 Sekunden

    // Cleanup-Funktion, um das Intervall zu löschen, wenn die Komponente unmontiert wird
    return () => clearInterval(intervalId);
  }, []);*/

  return (
    <>
      <LoadingScreen />
      <StatusBar style="auto" />
    </>
  );
}


