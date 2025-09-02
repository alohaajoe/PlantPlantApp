import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Titel from "./Titel";
import Colors from './assets/colors';

const PLANTPLANT_IMAGE = "./assets/plantie.png";

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <Titel style={styles.titel}>PlantPlant</Titel>
            <Image source={require(PLANTPLANT_IMAGE)} style={styles.plantplantImage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundNavigation,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    plantplantImage: {
      width: 279,
      height: 327,
      marginBottom: 20,
    },
    titel: {
      //top: -40, // y-Koordinate
      position: 'absolute',
      top: '20%',
      color: Colors.textLight,
    },
  });
  
  export default LoadingScreen;

