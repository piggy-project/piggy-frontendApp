import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {

  },
  background: {
    width: '100%',
    height: 400,
    justifyContent: 'space-between', // 내부 요소 상-하 배치 분배
    paddingTop: 15,
    paddingBottom: 26,
    backgroundColor: '#E0E0E0', // 이미지가 없을 때 보일 회색 배경색
  },
  textContainer: {
    marginLeft: 20,
  },
  title: {
    color: '#1B1B1B',
  },
  titletext: {
    color: '#868686',
    marginTop: 5,
  },
  rateRecorder: {
    marginHorizontal: 22,
    marginBottom: 4,
  },
  rateBubble: {
    position: 'absolute',
    bottom: 20,
    minWidth: 78,
    height: 34,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -39 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  rateBubbleText: {
    color: '#111',
  },
  rateBubbleIcon: {
    marginLeft: 4,
  },
  rateBubbleTail: {
    position: 'absolute',
    bottom: -5,
    left: '50%',
    marginLeft: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
  },
  rateBarTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    overflow: 'visible',
  },
  rateBarFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#FF8FA3',
  },
  rateBarThumb: {
    position: 'absolute',
    top: -2,
    width: 16,
    height: 16,
    marginLeft: -8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF8FA3',
  },
});
