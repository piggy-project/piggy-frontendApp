import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  backButton: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    paddingTop: 50,
    marginBottom: 100,
  },
  inputContainer: {
    marginBottom: 20,
  },
  linksContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 40,
  },
  linkText: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    marginHorizontal: 10,
    color: '#ddd',
  },
  bottomContainer: {
    marginTop: 'auto', // 하단으로 밀어내기
    marginBottom: 40,
  },
  socialTitle: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
    fontSize: 12,
  },
});