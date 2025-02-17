import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Titel from "./Titel";

const HEARTFULL_IMAGE = require("./assets/healthbar/HeartFull.png");
const HEARTEMPTY_IMAGE = require("./assets/healthbar/HeartEmpty.png");
const HEARTHALF_IMAGE = require("./assets/healthbar/HeartHalf.png");

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

    const mapDataToImage = () => {
      const number = data?.number;
      if (0 <= number && number <= 33) {
        return HEARTEMPTY_IMAGE;
      } else if (33 < number && number < 66) {
        return HEARTHALF_IMAGE;
      } else if (66 <= number && number <= 100) {
        return HEARTFULL_IMAGE;
      }
    }
  
    useEffect(() => {
      // Initialer Datenabruf
      fetchData();
      mapDataToImage();
  
      // Intervall für wiederholten Datenabruf
      const intervalId = setInterval(fetchData, 10000); // 10000 ms = 10 Sekunden
  
      // Cleanup-Funktion, um das Intervall zu löschen, wenn die Komponente unmontiert wird
      return () => clearInterval(intervalId);
    }, []);

    return (
      <View style={styles.container}>
      <Titel style={styles.titel}>PlantPlant</Titel>
      <Image source={mapDataToImage()} style={styles.heartImage} />
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
    top: '20%',
  },
  heartImage: {
    width: '14%',
    aspectRatio: 55 / 51.77,
    marginBottom: 20,
  },
});
