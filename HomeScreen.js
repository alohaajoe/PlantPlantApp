import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Titel from "./assets/Titel";
import styles from './assets/globalStyels';

const value_address = ("http://plantpi:8000/now/value")
const threshold_address = ("http://plantpi:8000/now/threshold")

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

const HomeScreen = () =>  {

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(null);
  const [threshold, setThreshold] = useState(null);
  const fetchValueData = () => fetchData(value_address, setValue);
  const fetchThresholdData = () => fetchData(threshold_address, setThreshold);


  const fetchData = async (url, setter) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const received = await response.json();
    console.log('Fetched data:', received);
    setter(received.message[0].value);
    setError(null);
  } catch (error) {
    console.error('Error fetching data:', error);
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

  const mapDataToHealthbar = () => {
    if (value === null || threshold === null) return;
    
    // Verhältnis Value * 1.3 zu Threshold damit mensch eher 5 Herzen sieht
    if (value > threshold) {
      var hearts = Math.round(((value * 1.3) / threshold) * 4) / 2;
    }
    else {
      var hearts = Math.round((value / threshold) * 4) / 2;
    }
    // Clamp zwischen 0 und 5
    hearts = Math.max(0, Math.min(5, hearts));

    switch (hearts) {
      case 0:   return HEALTH05_IMAGE; // oder eigenes 0er Bild?
      case 0.5: return HEALTH05_IMAGE;
      case 1:   return HEALTH1_IMAGE;
      case 1.5: return HEALTH15_IMAGE;
      case 2:   return HEALTH2_IMAGE;
      case 2.5: return HEALTH25_IMAGE;
      case 3:   return HEALTH3_IMAGE;
      case 3.5: return HEALTH35_IMAGE;
      case 4:   return HEALTH4_IMAGE;
      case 4.5: return HEALTH45_IMAGE;
      case 5:   return HEALTH5_IMAGE;
      default:  return HEALTH05_IMAGE;
    }
  }

  useEffect(() => {
    // Initialer Datenabruf
    fetchValueData();
    fetchThresholdData();
    // Intervall für wiederholten Datenabruf
    const queryInterval = setInterval(() => {
    fetchValueData();
    fetchThresholdData();
  }, (60000 * 30));

    // Cleanup-Funktion, um das Intervall zu löschen, wenn die Komponente unmontiert wird
    return () => clearInterval(queryInterval);

  }, []);

  return (
    <View style={styles.container}>
      <Titel style={styles.titel}>PlantPlant</Titel>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.block}>
          <Image source={mapDataToHealthbar()} style={styles.heartBar} />
          <Text style={styles.dataText}>Value: {value ?? 'Keine Daten'}</Text>
          <Text style={styles.dataText}>Threshold: {threshold ?? 'Keine Daten'}</Text>
        </View>
      )}
      {error && <Text style={styles.errorText}>Fehler: {error}</Text>}
    </View>
  );
};

export default HomeScreen;
