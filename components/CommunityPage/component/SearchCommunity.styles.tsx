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
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 0,
  },
  searchIcon: {
    marginRight: 6,
  },

  // ↓ search 모드(전체화면) 전용 스타일
  searchModeContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  searchModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButton: {
    width: 34,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  searchModeSection: {
    flex: 1,
    borderRadius: 22,
  },
  recentContainer: {
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  recentTitle: {
    marginBottom: 14,
    color: '#222',
    fontSize: 14,
    fontWeight: '600',
  },
  recentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 12,
  },
  recentChip: {
    maxWidth: '48%',
    minHeight: 30,
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 14,
  },
  recentChipText: {
    color: '#777',
    fontSize: 12,
  },
});