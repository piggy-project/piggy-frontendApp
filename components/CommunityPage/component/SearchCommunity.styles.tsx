import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 36,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 16,
    color: '#000',
    paddingVertical: 0,
  },
  searchIcon: {
    marginRight: 6,
  },
});