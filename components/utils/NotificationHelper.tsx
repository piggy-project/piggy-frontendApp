import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter, Platform } from 'react-native';
import { notificationApi } from './api';

export type StoredNotification = {
  id: string;
  title: string;
  body?: string;
  receivedAt: string;
  data?: Record<string, any>;
  isRead: boolean;
};

export const NOTIFICATION_STORAGE_KEY = 'piggy-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function saveNotification(notification: Notifications.Notification) {
  const content = notification.request.content;
  const nextItem: StoredNotification = {
    id: notification.request.identifier || `${Date.now()}`,
    title: content.title || '알림',
    body: content.body || '',
    receivedAt: new Date().toISOString(),
    data: content.data as Record<string, any>,
    isRead: false,
  };

  try {
    const saved = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    const previous = Array.isArray(parsed) ? parsed : [];
    const next = [
      nextItem,
      ...previous.filter((item: StoredNotification) => item.id !== nextItem.id),
    ].slice(0, 50);

    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(next));
    DeviceEventEmitter.emit('notifications-updated');
  } catch (error) {
    console.error('알림 저장 실패:', error);
  }
}

let listenersRegistered = false;

export function registerNotificationListeners() {
  if (listenersRegistered) return;
  listenersRegistered = true;

  Notifications.addNotificationReceivedListener((notification) => {
    saveNotification(notification);
  });

  Notifications.addNotificationResponseReceivedListener((response) => {
    saveNotification(response.notification);
  });
}

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
      await notificationApi.updateFcmToken(token);
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
