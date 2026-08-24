import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter, Platform } from 'react-native';
import { authApi, notificationApi } from './api';
import { getAccessToken } from './authStore';

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

const extractServerNotifications = (response: any) => {
  const candidates = [
    response,
    response?.data,
    response?.content,
    response?.notifications,
    response?.items,
    response?.data?.content,
    response?.data?.notifications,
    response?.data?.items,
  ];

  return candidates.find((candidate) => Array.isArray(candidate)) || [];
};

export async function syncServerNotificationsToLocal() {
  try {
    const response = await notificationApi.getNotifications();
    const serverItems = extractServerNotifications(response);
    const nextItems: StoredNotification[] = serverItems.map((item: any) => {
      const type = item.type || item.notificationType;
      const title = item.title || (
        type === 'TARGET_PRICE'
          ? '목표 환율 알림'
          : type === 'EXCHANGE_PERCENT'
            ? '환율 변동 알림'
            : type === 'LOWEST_PRICE'
              ? '최저가 알림'
              : type === 'VOLATILITY'
                ? '급등락 알림'
                : '알림'
      );

      return {
        id: String(item.id ?? item.notificationId ?? `${Date.now()}`),
        title,
        body: item.body || item.message || item.content || '',
        receivedAt: item.createdAt || item.sentAt || item.receivedAt || new Date().toISOString(),
        data: item,
        isRead: Boolean(item.isRead ?? item.read),
      };
    });

    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(nextItems));
    DeviceEventEmitter.emit('notifications-updated');
  } catch (error: any) {
    console.error('서버 알림 동기화 실패:', error.response?.data || error.message);
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
  let token: string | undefined;

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

    // 5. FCM / Push Token 가져오기
    try {
      // 1차 시도: Device Push Token (순수 Native FCM 토큰)
      try {
        const deviceTokenObj = await Notifications.getDevicePushTokenAsync();
        if (deviceTokenObj && deviceTokenObj.data) {
          token = typeof deviceTokenObj.data === 'string' ? deviceTokenObj.data : (deviceTokenObj.data as any).token;
          console.log('[FCM] Native Device Push Token 획득 성공:', token);
        }
      } catch (deviceErr) {
        console.warn('[FCM] getDevicePushTokenAsync 실패, getExpoPushTokenAsync 시도:', deviceErr);
      }

      // 2차 시도: Expo Push Token (DeviceToken 실패 시 또는 Expo Go 환경)
      if (!token) {
        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        
        if (projectId) {
          const expoTokenObj = await Notifications.getExpoPushTokenAsync({ projectId });
          token = expoTokenObj.data;
          console.log('[FCM] Expo Push Token 획득 성공:', token);
        } else {
          console.warn('[FCM] EAS Project ID를 찾을 수 없습니다.');
        }
      }

      if (!token) {
        throw new Error('Push Token을 획득하지 못했습니다.');
      }

      // 6. 로그인 상태인지 확인 후 백엔드로 토큰 전송
      const accessToken = await getAccessToken();

      if (!accessToken) {
        console.log('[FCM] 로그인 토큰(AccessToken)이 없어 서버 등록을 스킵합니다.');
        return token;
      }

      // 백엔드로 토큰 등록 시도 (notificationApi 및 userApi 폴백 처리)
      try {
        await notificationApi.updateFcmToken(token);
        console.log('[FCM] 서버에 FCM 토큰 등록 완료 (/api/notifications/token)');
      } catch (apiErr: any) {
        console.warn('[FCM] notificationApi.updateFcmToken 실패, userApi.updateFcmToken 시도:', apiErr?.response?.status || apiErr?.message);
        try {
          await authApi.updateFcmToken(token);
          console.log('[FCM] 서버에 FCM 토큰 등록 완료 (/users/fcm-token)');
        } catch (userApiErr: any) {
          console.error('[FCM] FCM 토큰 서버 등록 실패 (500/에러):', userApiErr?.response?.data || userApiErr?.message || userApiErr);
        }
      }
      
    } catch (e: any) {
      console.error('FCM 토큰 획득/등록 과정 에러:', e?.response?.data || e?.message || e);
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
