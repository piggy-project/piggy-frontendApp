import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    paddingHorizontal: 20, 
    
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
  },
  leftArea: {
    width: 40,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightArea: {
    width: 40,
    alignItems: 'flex-end',
  },
});