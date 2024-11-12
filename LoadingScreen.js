import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Titel from "./Titel";

const PLANTPLANT_IMAGE = "./assets/plantplant.png";

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
      backgroundColor: '#D5C6A9',
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
      top: -40, // y-Koordinate
    },
  });
  
  export default LoadingScreen;

