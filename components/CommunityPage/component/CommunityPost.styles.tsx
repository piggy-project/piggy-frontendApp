import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#D9D9D9', // 이미지와 같은 연회색 배경
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  userName: {
    flex: 1,
  },
  timeText: {
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#888',
    marginBottom: 15,
  },
  content: {
    color: '#000',
    marginBottom: 20,
    minHeight: 40,
  },
  footer: {
    alignItems: 'flex-end',
  },
  interactionBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  interactionText: {
    color: '#888',
    marginLeft: 5,
  },
});