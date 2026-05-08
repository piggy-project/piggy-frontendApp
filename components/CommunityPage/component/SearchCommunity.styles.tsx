import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 10
  },
});