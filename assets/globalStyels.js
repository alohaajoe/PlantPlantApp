// globalStyles.js
import { StyleSheet } from "react-native";
import Colors from "./colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.textDark,
  },
  errorText: {
    position: 'absolute',
    bottom: '10%',
    color: Colors.error,
  },
});
