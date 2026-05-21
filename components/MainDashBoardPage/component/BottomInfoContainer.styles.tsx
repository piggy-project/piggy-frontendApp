import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
  },
  
  // 1. 환율 정보 바 스타일
  rateInfoBar: {
    backgroundColor: '#E0E0E0', // 연한 회색 배경
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rateText: {
    color: '#333',
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryName: {
    color: '#333',
  },
  flagIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
