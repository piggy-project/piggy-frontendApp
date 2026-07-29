import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
  },
  
  rateInfoCard: {
    minHeight: 68,
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  rateInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  rateIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF8FA3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rateIconText: {
    color: '#fff',
  },
  rateText: {
    color: '#111',
  },
  changeText: {
    color: '#FF3B57',
    marginTop: 2,
  },
  exchangeRecordButton: {
    minWidth: 92,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exchangeRecordText: {
    color: '#555',
  },

  // 2. 그래프 영역 스타일
  graphArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatbotButton: {
    minHeight: 72,
    marginTop: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#FFD3DD',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatbotButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  chatbotButtonImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  chatbotButtonText: {
    color: '#111',
    flexShrink: 1,
  },
});
