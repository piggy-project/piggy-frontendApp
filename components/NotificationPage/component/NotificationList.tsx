import { notificationApi } from '@/components/utils/api';
import { NOTIFICATION_STORAGE_KEY, StoredNotification } from '@/components/utils/NotificationHelper';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './NotificationList.styles';

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  receivedAt: string;
  type?: string;
  isRead: boolean;
  isLocal?: boolean;
};

type ServerNotification = {
  id?: number | string;
  notificationId?: number | string;
  title?: string;
  body?: string;
  message?: string;
  content?: string;
  type?: string;
  notificationType?: string;
  typeLabel?: string;
  currencyCode?: string;
  createdAt?: string;
  createdDate?: string;
  sentAt?: string;
  receivedAt?: string;
  readAt?: string | null;
  isRead?: boolean;
  read?: boolean;
};

const getTimeText = (receivedAt: string) => {
  const receivedTime = new Date(receivedAt).getTime();
  if (!Number.isFinite(receivedTime)) return '';

  const diffMinutes = Math.max(0, Math.floor((Date.now() - receivedTime) / 60000));
  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  return `${Math.floor(diffHours / 24)}일 전`;
};

const getTypeTitle = (type?: string) => {
  switch (type) {
    case 'EXCHANGE_PERCENT':
      return '환율 변동 알림';
    case 'TARGET_PRICE':
      return '목표 환율 알림';
    case 'LOWEST_PRICE':
      return '최저가 알림';
    case 'VOLATILITY':
      return '급등락 알림';
    default:
      return '알림';
  }
};

const mapServerNotification = (item: ServerNotification): NotificationItem => {
  const id = String(item.id ?? item.notificationId ?? `${Date.now()}`);
  const type = item.type ?? item.notificationType;
  const title = item.title || item.typeLabel || getTypeTitle(type);
  const body = item.body ?? item.message ?? item.content ?? '';
  const currencyPrefix = item.currencyCode && !title.includes(item.currencyCode)
    ? `[${item.currencyCode}] `
    : '';

  return {
    id,
    type,
    title: `${currencyPrefix}${title}`,
    body,
    receivedAt: item.createdAt || item.createdDate || item.sentAt || item.receivedAt || new Date().toISOString(),
    isRead: Boolean(item.isRead ?? item.read ?? item.readAt),
  };
};

const mapLocalNotification = (item: StoredNotification): NotificationItem => ({
  id: item.id,
  title: item.title,
  body: item.body,
  receivedAt: item.receivedAt,
  isRead: item.isRead,
  isLocal: true,
});

const extractNotificationArray = (response: any): ServerNotification[] => {
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

export default function NotificationList() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocalNotifications = async () => {
    const saved = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.map(mapLocalNotification) : [];
  };

  const fetchNotifications = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const response = await notificationApi.getNotifications();
      const serverItems = extractNotificationArray(response).map(mapServerNotification);
      setNotifications(serverItems);
    } catch (error: any) {
      console.error('서버 알림함 조회 실패:', error.response?.data || error.message);

      try {
        const localItems = await fetchLocalNotifications();
        setNotifications(localItems);
      } catch (localError) {
        console.error('로컬 알림 로딩 실패:', localError);
        setNotifications([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('notifications-updated', () => {
      fetchNotifications(false);
    });

    return () => subscription.remove();
  }, [fetchNotifications]);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications(false);
  };

  const handlePress = async (item: NotificationItem) => {
    if (item.isRead || item.isLocal) return;

    setNotifications((prev) => (
      prev.map((notification) => (
        notification.id === item.id ? { ...notification, isRead: true } : notification
      ))
    ));

    try {
      await notificationApi.markNotificationAsRead(item.id);
    } catch (error: any) {
      console.error('알림 읽음 처리 실패:', error.response?.data || error.message);
      fetchNotifications(false);
    }
  };

  const handleDelete = async (item: NotificationItem) => {
    const previous = notifications;
    const nextNotifications = notifications.filter((notification) => notification.id !== item.id);
    setNotifications(nextNotifications);

    try {
      if (item.isLocal) {
        await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(nextNotifications));
      } else {
        await notificationApi.deleteNotification(item.id);
      }
    } catch (error: any) {
      console.error('알림 삭제 실패:', error.response?.data || error.message);
      setNotifications(previous);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.emptyText, Typography.Pretendard_M_16]}>새로운 알림이 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.itemContainer, !item.isRead && styles.unreadItemContainer]}
          activeOpacity={0.75}
          onPress={() => handlePress(item)}
        >
          <View style={[styles.iconCircle, !item.isRead && styles.unreadIconCircle]}>
            <Ionicons name="notifications" size={20} color="#FF8FA3" />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, Typography.Pretendard_M_14]} numberOfLines={1}>
              {item.title}
            </Text>
            {!!item.body && (
              <Text style={[styles.body, Typography.Pretendard_M_12]} numberOfLines={2}>
                {item.body}
              </Text>
            )}
            <Text style={[styles.time, Typography.Pretendard_M_12]}>{getTimeText(item.receivedAt)}</Text>
          </View>

          {!item.isRead && <View style={styles.unreadDot} />}

          <TouchableOpacity
            onPress={() => handleDelete(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color="#bbb" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}
