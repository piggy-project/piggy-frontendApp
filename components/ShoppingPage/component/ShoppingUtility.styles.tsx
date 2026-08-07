import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  floatingActionContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  floatingCameraButton: {
    width: 60, // 원형 크기
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFB7C5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20, // 하단 여백
    right: 20, // 우측 여백
    // 그림자 효과 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
});