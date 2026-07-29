import { NOTIFICATION_STORAGE_KEY, StoredNotification } from '@/components/utils/NotificationHelper';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './NotificationList.styles';

const getTimeText = (receivedAt: string) => {
  const receivedTime = new Date(receivedAt).getTime();
  const diffMinutes = Math.max(0, Math.floor((Date.now() - receivedTime) / 60000));

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  return `${Math.floor(diffHours / 24)}일 전`;
};

export default function NotificationList() {
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const subscription = DeviceEventEmitter.addListener('notifications-updated', fetchNotifications);

    return () => subscription.remove();
  }, []);

  const fetchNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      setNotifications(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error('알림 로딩 실패', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const nextNotifications = notifications.filter((item) => item.id !== id);
    setNotifications(nextNotifications);
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(nextNotifications));
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
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <View style={styles.iconCircle}>
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

          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color="#bbb" />
          </TouchableOpacity>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}
