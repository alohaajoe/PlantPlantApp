import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Titel from "./Titel";

const AnalyseScreen = () => {
    return (
        <View style={styles.container}>
            <Titel style={styles.titel}>Datenanalyse</Titel>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 24,
    },
});

export default AnalyseScreen;