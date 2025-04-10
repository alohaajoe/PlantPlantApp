import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Titel from "./Titel";

const HEALTH05_IMAGE = require("./assets/healthbar/Health05.png");
const HEALTH1_IMAGE = require("./assets/healthbar/Health1.png");
const HEALTH15_IMAGE = require("./assets/healthbar/Health15.png");
const HEALTH2_IMAGE = require("./assets/healthbar/Health2.png");
const HEALTH25_IMAGE = require("./assets/healthbar/Health25.png");
const HEALTH3_IMAGE = require("./assets/healthbar/Health3.png");
const HEALTH35_IMAGE = require("./assets/healthbar/Health35.png");
const HEALTH4_IMAGE = require("./assets/healthbar/Health4.png");
const HEALTH45_IMAGE = require("./assets/healthbar/Health45.png");
const HEALTH5_IMAGE = require("./assets/healthbar/Health5.png");

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

  const mapDataToHealthbar = () => {
    const number = data?.number;
    if (0 <= number && number < 10) {
      return HEALTH05_IMAGE;
    } else if (10 <= number && number < 20) {
      return HEALTH1_IMAGE;
    } else if (20 <= number && number < 30) {
      return HEALTH15_IMAGE;
    } else if (30 <= number && number < 40) {
      return HEALTH2_IMAGE;
    } else if (40 <= number && number < 50) {
      return HEALTH25_IMAGE;
    } else if (50 <= number && number < 60) {
      return HEALTH3_IMAGE;
    } else if (60 <= number && number < 70) {
      return HEALTH35_IMAGE;
    } else if (70 <= number && number < 80) {
      return HEALTH4_IMAGE;
    } else if (80 <= number && number < 90) {
      return HEALTH45_IMAGE;
    } else if (90 <= number && number <= 100) {
      return HEALTH5_IMAGE;
    }
  }

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
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.block}>
          <Image source={mapDataToHealthbar()} style={styles.heartBar} />
          <Text style={styles.dataText}>Empfangene Zahl: {data?.number ?? 'Keine Daten'}</Text>
        </View>
      )}
      {error && <Text style={styles.errorText}>Fehler: {error}</Text>}
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
  block: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: '4%',
  },
  titel: {
    position: 'absolute',
    top: '20%',
  },
  heartBar: {
    bottom: '3%',
  },
  dataText: {
    fontSize: 18,
  },
  errorText: {
    marginTop: 20,
    color: 'red',
  },
});
