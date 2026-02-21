import { StyleSheet } from 'react-native';

/**
 * 피그마 디자인 시스템 기반 타이포그래피 템플릿
 * 자간 계산 공식: fontSize * (자간% / 100)
 */
export const Typography = StyleSheet.create({
  // 1번: 24px / 38px / -3%
  Pretendard_E_24: {
    fontFamily: 'Pretendard-ExtraBold',
    fontSize: 24,
    lineHeight: 38,
    letterSpacing: -0.72, // 24 * -0.03
  },
  // 2번: 20px / 31px / -4%
  Pretendard_M_20: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    lineHeight: 31,
    letterSpacing: -0.8, // 20 * -0.04
  },
  // 3번: 16px / 25px / -4%
  Pretendard_M_16: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    lineHeight: 25,
    letterSpacing: -0.64, // 16 * -0.04
  },
  // 4번: 14px / 22px / -4%
  Pretendard_M_14: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.56, // 14 * -0.04
  },
  // 5번: 12px / 19px / -4%
  Pretendard_M_12: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 19,
    letterSpacing: -0.48, // 12 * -0.04
  },
  // 6번: 11px / 17px / -3%
  Pretendard_M_11: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 11,
    lineHeight: 17,
    letterSpacing: -0.33, // 11 * -0.03
  },
  // 7번: 32px / 48px / -2%
  Pretendard_B_32: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    lineHeight: 48,
    letterSpacing: -0.64, // 32 * -0.02
  },
  // 8번: 24px / 36px / -3%
  Pretendard_B_24: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: -0.72,
  }
});