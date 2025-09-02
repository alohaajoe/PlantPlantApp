import { View } from 'react-native';
import Titel from "./assets/Titel";
import styles from './assets/globalStyels';

const AnalyseScreen = () => {
    return (
        <View style={styles.container}>
            <Titel style={styles.titel}>Datenanalyse</Titel>
        </View>
    );
};

export default AnalyseScreen;