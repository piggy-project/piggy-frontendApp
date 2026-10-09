import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  unreadItemContainer: {
    backgroundColor: '#FFF8FA',
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFE8EE',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadIconCircle: {
    backgroundColor: '#FFDDE7',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    color: '#333',
    marginBottom: 4,
  },
  time: {
    color: '#888',
  },
  body: {
    color: '#666',
    marginBottom: 4,
  },
  emptyText: {
    color: '#999',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF6B8A',
    marginRight: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
  },
});
