import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageText: { color: '#666' },
  nickname: {
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  editButtonText: {
    color: '#000000',
  },
  logoutButton: {
    marginTop: 10,
    padding: 5,
  },
  logoutButtonText: {
    color: '#888',
    textDecorationLine: 'underline',
  },
});