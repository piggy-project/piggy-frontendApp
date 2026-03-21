import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { authApi } from './api';

export async function registerForPushNotificationsAsync() {
  let token;

  // 1. 실제 기기인지 확인
  if (Device.isDevice) {
    // 2. 현재 알림 권한 상태 확인
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 3. 권한이 없다면 요청
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // 4. 권한 거절 시 종료
    if (finalStatus !== 'granted') {
      console.warn('푸시 알림 권한 획득 실패');
      return;
    }

    // 5. Expo Push Token (FCM) 가져오기
    try {
      // app.json의 projectId를 자동으로 참조합니다.
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      
      if (!projectId) {
        throw new Error('EAS Project ID를 찾을 수 없습니다. app.json 설정을 확인하세요.');
      }

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('FCM Token 획득:', token);

      // 6. 서버로 토큰 전송
      await authApi.updateFcmToken(token);
      console.log('서버에 FCM 토큰 등록 완료');
      
    } catch (e) {
      console.error('FCM 토큰 등록 중 에러 발생:', e);
    }
  } else {
    console.log('물리적인 기기에서만 푸시 알림이 작동합니다.');
  }

  // 안드로이드 채널 설정
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFB7C5',
    });
  }

  return token;
}