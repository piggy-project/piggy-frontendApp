import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    // 그림자 효과
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignSelf: 'center',
  },
  chartContainer: {
    width: '100%',
    height: 260, // 상하 라벨 여백을 위해 전체 높이 확보
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartWrapper: {
    width: '100%',
    overflow: 'hidden', // 여기서 차트의 삐져나온 부분을 확실히 자름
    alignItems: 'center',
    justifyContent: 'center',
    height: 270, // marginTop(35) + chartHeight(220) + 여유공간 확보
  },
  labelBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    width: '100%',
  },
  labelText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '600',
  },
  pointText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  dotGlow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotHighlight: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  graphContainer: {
    height: 250,
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    marginBottom: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#999',
    fontSize: 14,
  },
});